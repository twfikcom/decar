<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class LTI_Admin_UI {

	public static function init(): void {
		add_action( 'add_meta_boxes', array( __CLASS__, 'register_meta_boxes' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ) );
	}

	public static function enqueue_assets( string $hook ): void {
		global $post;

		if ( ! in_array( $hook, array( 'post.php', 'post-new.php' ), true ) ) {
			return;
		}

		if ( ! $post || ! LTI_Meta_Fields::is_vehicle_post( $post ) ) {
			return;
		}

		wp_enqueue_style(
			'lti-admin',
			LTI_PLUGIN_URL . 'assets/admin.css',
			array(),
			LTI_VERSION
		);
	}

	public static function register_meta_boxes(): void {
		add_meta_box(
			'lti_shared_specs',
			__( 'Vehicle specifications (shared across languages)', 'lowe-trucks-inventory' ),
			array( __CLASS__, 'render_shared_box' ),
			array( LTI_Post_Types::TRUCK, LTI_Post_Types::CAR ),
			'normal',
			'high'
		);

		add_meta_box(
			'lti_type_specs',
			__( 'Type-specific fields', 'lowe-trucks-inventory' ),
			array( __CLASS__, 'render_type_box' ),
			array( LTI_Post_Types::TRUCK, LTI_Post_Types::CAR ),
			'normal',
			'high'
		);

		add_meta_box(
			'lti_multilingual',
			__( 'Multilingual content (DE / EN / AR)', 'lowe-trucks-inventory' ),
			array( __CLASS__, 'render_multilingual_box' ),
			array( LTI_Post_Types::TRUCK, LTI_Post_Types::CAR ),
			'normal',
			'high'
		);
	}

	private static function render_nonce(): void {
		wp_nonce_field( 'lti_save_vehicle', 'lti_vehicle_nonce' );
	}

	public static function render_shared_box( WP_Post $post ): void {
		self::render_nonce();
		$fields = LTI_Meta_Fields::shared_field_defs();
		echo '<div class="lti-field-grid">';

		foreach ( $fields as $key => $def ) {
			self::render_field( $post->ID, $key, $def );
		}

		echo '</div>';
		echo '<p class="description">' . esc_html__( 'Numeric and technical values are shared. Enum keys (condition, category, body type, fuel) use German values to match the Next.js frontend.', 'lowe-trucks-inventory' ) . '</p>';
	}

	public static function render_type_box( WP_Post $post ): void {
		$fields = LTI_Post_Types::TRUCK === $post->post_type
			? LTI_Meta_Fields::truck_field_defs()
			: LTI_Meta_Fields::car_field_defs();

		echo '<div class="lti-field-grid">';
		foreach ( $fields as $key => $def ) {
			self::render_field( $post->ID, $key, $def );
		}
		echo '</div>';
	}

	public static function render_multilingual_box( WP_Post $post ): void {
		$lang_labels = array(
			'de' => 'Deutsch',
			'en' => 'English',
			'ar' => 'العربية',
		);

		echo '<div class="lti-lang-tabs">';
		foreach ( LTI_Meta_Fields::LANGS as $index => $lang ) {
			$active = 0 === $index ? ' is-active' : '';
			printf(
				'<button type="button" class="lti-lang-tab%s" data-lang="%s">%s</button>',
				esc_attr( $active ),
				esc_attr( $lang ),
				esc_html( strtoupper( $lang ) . ' — ' . $lang_labels[ $lang ] )
			);
		}
		echo '</div>';

		foreach ( LTI_Meta_Fields::LANGS as $index => $lang ) {
			$active = 0 === $index ? ' is-active' : '';
			echo '<div class="lti-lang-panel' . esc_attr( $active ) . '" data-lang-panel="' . esc_attr( $lang ) . '">';

			$title = LTI_Meta_Fields::get_lang_value( $post->ID, 'title', $lang );
			$desc  = LTI_Meta_Fields::get_lang_value( $post->ID, 'description', $lang );
			$feat  = LTI_Meta_Fields::get_lang_value( $post->ID, 'features', $lang );

			echo '<p><label><strong>' . esc_html__( 'Title', 'lowe-trucks-inventory' ) . '</strong></label>';
			printf(
				'<input type="text" class="widefat" name="lti_title_%1$s" value="%2$s" placeholder="%3$s">',
				esc_attr( $lang ),
				esc_attr( $title ),
				esc_attr__( 'Vehicle title in this language', 'lowe-trucks-inventory' )
			);
			echo '</p>';

			echo '<p><label><strong>' . esc_html__( 'Description', 'lowe-trucks-inventory' ) . '</strong></label>';
			printf(
				'<textarea class="widefat" rows="6" name="lti_description_%1$s" placeholder="%2$s">%3$s</textarea>',
				esc_attr( $lang ),
				esc_attr__( 'Full vehicle description…', 'lowe-trucks-inventory' ),
				esc_textarea( $desc )
			);
			echo '</p>';

			echo '<p><label><strong>' . esc_html__( 'Features (one per line)', 'lowe-trucks-inventory' ) . '</strong></label>';
			printf(
				'<textarea class="widefat" rows="8" name="lti_features_%1$s" placeholder="%2$s">%3$s</textarea>',
				esc_attr( $lang ),
				esc_attr__( "Klimaanlage\nStandheizung\nRetarder", 'lowe-trucks-inventory' ),
				esc_textarea( $feat )
			);
			echo '</p>';

			echo '</div>';
		}

		echo '<p class="description">' . esc_html__( 'Fill all three languages on this page. German (DE) is used as fallback when a translation is empty.', 'lowe-trucks-inventory' ) . '</p>';
		echo '<script>(function(){var tabs=document.querySelectorAll(".lti-lang-tab");var panels=document.querySelectorAll(".lti-lang-panel");tabs.forEach(function(tab){tab.addEventListener("click",function(){var lang=tab.getAttribute("data-lang");tabs.forEach(function(t){t.classList.remove("is-active");});panels.forEach(function(p){p.classList.remove("is-active");});tab.classList.add("is-active");var panel=document.querySelector(\'[data-lang-panel="\'+lang+\'"]\');if(panel){panel.classList.add("is-active");}});});})();</script>';
	}

	private static function render_field( int $post_id, string $key, array $def ): void {
		$value     = LTI_Meta_Fields::get_meta_value( $post_id, $key );
		$input_id  = 'lti_' . $key;
		$input_name = 'lti_' . $key;

		echo '<p class="lti-field">';
		echo '<label for="' . esc_attr( $input_id ) . '"><strong>' . esc_html( $def['label'] ) . '</strong></label>';

		switch ( $def['type'] ) {
			case 'number':
				printf(
					'<input type="number" id="%1$s" name="%2$s" value="%3$s" class="widefat" min="0" step="1">',
					esc_attr( $input_id ),
					esc_attr( $input_name ),
					esc_attr( $value )
				);
				break;

			case 'textarea':
				printf(
					'<textarea id="%1$s" name="%2$s" class="widefat" rows="4">%3$s</textarea>',
					esc_attr( $input_id ),
					esc_attr( $input_name ),
					esc_textarea( (string) $value )
				);
				break;

			case 'select':
				printf( '<select id="%1$s" name="%2$s" class="widefat">', esc_attr( $input_id ), esc_attr( $input_name ) );
				foreach ( $def['options'] as $option ) {
					printf(
						'<option value="%1$s" %2$s>%3$s</option>',
						esc_attr( $option ),
						selected( $value, $option, false ),
						esc_html( $option )
					);
				}
				echo '</select>';
				break;

			case 'checkbox':
				printf(
					'<label><input type="checkbox" id="%1$s" name="%2$s" value="1" %3$s> %4$s</label>',
					esc_attr( $input_id ),
					esc_attr( $input_name ),
					checked( $value, '1', false ),
					esc_html__( 'Show on homepage featured section', 'lowe-trucks-inventory' )
				);
				break;

			default:
				printf(
					'<input type="text" id="%1$s" name="%2$s" value="%3$s" class="widefat">',
					esc_attr( $input_id ),
					esc_attr( $input_name ),
					esc_attr( $value )
				);
		}

		echo '</p>';
	}
}
