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

		if ( ! $post || ( ! LTI_Meta_Fields::is_vehicle_post( $post ) && ! LTI_Meta_Fields::is_part_post( $post ) ) ) {
			return;
		}

		wp_enqueue_media();
		wp_enqueue_editor();

		wp_enqueue_style(
			'lti-admin',
			LTI_PLUGIN_URL . 'assets/admin.css',
			array(),
			LTI_VERSION
		);

		wp_enqueue_script(
			'lti-admin',
			LTI_PLUGIN_URL . 'assets/admin.js',
			array( 'jquery' ),
			LTI_VERSION,
			true
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
			'lti_media',
			__( 'Thumbnail & gallery', 'lowe-trucks-inventory' ),
			array( __CLASS__, 'render_media_box' ),
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

		add_meta_box(
			'lti_part_external',
			__( 'Spare part: ID & photo', 'lowe-trucks-inventory' ),
			array( __CLASS__, 'render_part_external_box' ),
			LTI_Post_Types::PART,
			'normal',
			'high'
		);

		add_meta_box(
			'lti_part_multilingual',
			__( 'Spare part text (DE / EN / AR)', 'lowe-trucks-inventory' ),
			array( __CLASS__, 'render_part_multilingual_box' ),
			LTI_Post_Types::PART,
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
		echo '<p class="description">' . esc_html__( 'Technical values and video URL are shared. Use the Featured Image box (right sidebar) for the listing thumbnail.', 'lowe-trucks-inventory' ) . '</p>';
	}

	public static function render_media_box( WP_Post $post ): void {
		$gallery_ids = LTI_Meta_Fields::get_gallery_ids( $post->ID );
		$value       = implode( ',', $gallery_ids );

		echo '<p class="description">' . esc_html__( 'Upload gallery images from the media library. The featured image (sidebar) is used as the main thumbnail on the website.', 'lowe-trucks-inventory' ) . '</p>';
		echo '<input type="hidden" id="lti_gallery_ids" name="lti_gallery_ids" value="' . esc_attr( $value ) . '">';
		echo '<div id="lti-gallery-preview" class="lti-gallery-preview"></div>';
		echo '<p class="lti-gallery-actions">';
		echo '<button type="button" class="button button-primary" id="lti-gallery-pick">' . esc_html__( 'Add / upload gallery images', 'lowe-trucks-inventory' ) . '</button> ';
		echo '<button type="button" class="button" id="lti-gallery-clear">' . esc_html__( 'Clear gallery', 'lowe-trucks-inventory' ) . '</button>';
		echo '</p>';
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

		$groups = LTI_Feature_Options::groups_for_post_type( $post->post_type );

		foreach ( LTI_Meta_Fields::LANGS as $index => $lang ) {
			$active = 0 === $index ? ' is-active' : '';
			echo '<div class="lti-lang-panel' . esc_attr( $active ) . '" data-lang-panel="' . esc_attr( $lang ) . '">';

			$title = LTI_Meta_Fields::get_lang_value( $post->ID, 'title', $lang );
			$desc  = LTI_Meta_Fields::get_lang_value( $post->ID, 'description', $lang );
			$keys  = LTI_Meta_Fields::get_feature_keys( $post->ID, $lang );

			echo '<p><label><strong>' . esc_html__( 'Title', 'lowe-trucks-inventory' ) . '</strong></label>';
			printf(
				'<input type="text" class="widefat" name="lti_title_%1$s" value="%2$s" placeholder="%3$s">',
				esc_attr( $lang ),
				esc_attr( $title ),
				esc_attr__( 'Vehicle title in this language', 'lowe-trucks-inventory' )
			);
			echo '</p>';

			self::render_description_editor( $lang, $desc, __( 'Full vehicle description…', 'lowe-trucks-inventory' ), 10 );

			echo '<div class="lti-features-section">';
			echo '<strong>' . esc_html__( 'Features & options', 'lowe-trucks-inventory' ) . '</strong>';
			echo '<div class="lti-feature-groups">';

			foreach ( $groups as $group_key => $group ) {
				$group_label = $group['label']['en'] ?? $group['label']['de'];
				echo '<div class="lti-feature-group">';
				echo '<h4 class="lti-feature-group-title">' . esc_html( $group_label ) . '</h4>';
				echo '<div class="lti-feature-grid">';

				foreach ( $group['items'] as $item_key => $labels ) {
					$label    = $labels['en'] ?? $labels['de'];
					$checked  = in_array( $item_key, $keys, true );
					$input_id = 'lti_feature_' . $lang . '_' . $group_key . '_' . $item_key;

					printf(
						'<label class="lti-feature-option" for="%1$s"><input type="checkbox" id="%1$s" name="lti_feature_keys_%2$s[]" value="%3$s" %4$s> %5$s</label>',
						esc_attr( $input_id ),
						esc_attr( $lang ),
						esc_attr( $item_key ),
						checked( $checked, true, false ),
						esc_html( $label )
					);
				}

				echo '</div></div>';
			}

			echo '</div></div>';
			echo '</div>';
		}

		echo '<p class="description">' . esc_html__( 'Fill title, description and features for each language on this page. German (DE) is used as fallback when a translation is empty.', 'lowe-trucks-inventory' ) . '</p>';
		echo '<p class="description">' . esc_html__( 'Feature checkboxes stay in sync across DE, EN, and AR: changing one language updates the same options in the other tabs.', 'lowe-trucks-inventory' ) . '</p>';
	}

	public static function render_part_external_box( WP_Post $post ): void {
		wp_nonce_field( 'lti_save_part', 'lti_part_nonce' );
		$ext = LTI_Meta_Fields::get_meta_value( $post->ID, 'external_id' );

		echo '<p><label for="lti_external_id"><strong>' . esc_html__( 'Part ID (optional)', 'lowe-trucks-inventory' ) . '</strong></label>';
		printf(
			'<input type="text" class="widefat" id="lti_external_id" name="lti_external_id" value="%s" placeholder="p-001">',
			esc_attr( (string) $ext )
		);
		echo '</p>';
		echo '<p class="description">' . esc_html__( 'Leave blank to auto-generate (p-{number}). The Next.js site shows all parts on one page only — no separate URL per part.', 'lowe-trucks-inventory' ) . '</p>';
		echo '<p class="description">' . esc_html__( 'Use the Featured Image box (right sidebar) as the part photo on the website.', 'lowe-trucks-inventory' ) . '</p>';
		echo '<p class="description">' . esc_html__( 'The post title above is for your reference in the admin list.', 'lowe-trucks-inventory' ) . '</p>';
	}

	public static function render_part_multilingual_box( WP_Post $post ): void {
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

			echo '<p><label><strong>' . esc_html__( 'Title', 'lowe-trucks-inventory' ) . '</strong></label>';
			printf(
				'<input type="text" class="widefat" name="lti_title_%1$s" value="%2$s" placeholder="%3$s">',
				esc_attr( $lang ),
				esc_attr( $title ),
				esc_attr__( 'Short headline for this language', 'lowe-trucks-inventory' )
			);
			echo '</p>';

			self::render_description_editor( $lang, $desc, __( 'Explain the part, compatibility, condition…', 'lowe-trucks-inventory' ), 8 );

			echo '</div>';
		}

		echo '<p class="description">' . esc_html__( 'German (DE) is used as fallback when a translation is empty.', 'lowe-trucks-inventory' ) . '</p>';
	}

	private static function render_description_editor( string $lang, string $content, string $placeholder, int $rows ): void {
		$editor_id = 'lti_description_' . $lang;

		echo '<div class="lti-description-field">';
		echo '<label for="' . esc_attr( $editor_id ) . '"><strong>' . esc_html__( 'Description', 'lowe-trucks-inventory' ) . '</strong></label>';
		echo '<p class="description">' . esc_html__( 'Formatting (bold, lists, links) is preserved on the website.', 'lowe-trucks-inventory' ) . '</p>';

		wp_editor(
			$content,
			$editor_id,
			array(
				'textarea_name' => $editor_id,
				'textarea_rows' => $rows,
				'media_buttons' => true,
				'teeny'         => false,
				'quicktags'     => true,
				'tinymce'       => array(
					'toolbar1' => 'formatselect,bold,italic,underline,bullist,numlist,link,unlink,blockquote,undo,redo',
				),
				'editor_class'  => 'lti-wp-editor',
				'placeholder'   => $placeholder,
			)
		);

		echo '</div>';
	}

	private static function render_field( int $post_id, string $key, array $def ): void {
		$value      = LTI_Meta_Fields::get_meta_value( $post_id, $key );
		$input_id   = 'lti_' . $key;
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

			case 'select':
				$option_labels = $def['option_labels'] ?? array();
				printf( '<select id="%1$s" name="%2$s" class="widefat">', esc_attr( $input_id ), esc_attr( $input_name ) );
				foreach ( $def['options'] as $option ) {
					$opt_label = $option_labels[ $option ] ?? $option;
					printf(
						'<option value="%1$s" %2$s>%3$s</option>',
						esc_attr( $option ),
						selected( $value, $option, false ),
						esc_html( $opt_label )
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

			case 'url':
				printf(
					'<input type="url" id="%1$s" name="%2$s" value="%3$s" class="widefat" placeholder="https://www.youtube.com/watch?v=...">',
					esc_attr( $input_id ),
					esc_attr( $input_name ),
					esc_attr( $value )
				);
				break;

			default:
				$placeholder = isset( $def['placeholder'] ) ? (string) $def['placeholder'] : '';
				printf(
					'<input type="text" id="%1$s" name="%2$s" value="%3$s" class="widefat"%4$s>',
					esc_attr( $input_id ),
					esc_attr( $input_name ),
					esc_attr( $value ),
					$placeholder ? ' placeholder="' . esc_attr( $placeholder ) . '"' : ''
				);
		}

		echo '</p>';
	}
}
