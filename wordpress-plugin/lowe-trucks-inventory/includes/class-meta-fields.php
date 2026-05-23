<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class LTI_Meta_Fields {

	public const LANGS = array( 'de', 'en', 'ar' );

	public static function init(): void {
		add_action( 'save_post_' . LTI_Post_Types::TRUCK, array( __CLASS__, 'save_vehicle' ), 10, 2 );
		add_action( 'save_post_' . LTI_Post_Types::CAR, array( __CLASS__, 'save_vehicle' ), 10, 2 );
	}

	public static function shared_field_defs(): array {
		return array(
			'external_id' => array( 'type' => 'text', 'label' => 'Vehicle ID (slug for Next.js, e.g. t-001)' ),
			'brand'       => array( 'type' => 'text', 'label' => 'Brand' ),
			'model'       => array( 'type' => 'text', 'label' => 'Model' ),
			'year'        => array( 'type' => 'number', 'label' => 'Year' ),
			'mileage'     => array( 'type' => 'number', 'label' => 'Mileage (km)' ),
			'price'       => array( 'type' => 'number', 'label' => 'Price (EUR)' ),
			'power'       => array( 'type' => 'number', 'label' => 'Power (PS)' ),
			'condition'   => array( 'type' => 'select', 'label' => 'Condition', 'options' => array( 'Neu', 'Gebraucht' ) ),
			'featured'    => array( 'type' => 'checkbox', 'label' => 'Featured on homepage' ),
			'image_urls'  => array( 'type' => 'textarea', 'label' => 'Gallery image URLs (one per line)' ),
		);
	}

	public static function truck_field_defs(): array {
		return array(
			'category' => array(
				'type'    => 'select',
				'label'   => 'Truck category',
				'options' => array( 'Sattelzugmaschine', 'Festaufbau', 'Kipper', 'Kastenwagen' ),
			),
		);
	}

	public static function car_field_defs(): array {
		return array(
			'body_type' => array(
				'type'    => 'select',
				'label'   => 'Body type',
				'options' => array( 'Limousine', 'SUV', 'Kombi', 'Kompakt', 'Coupé' ),
			),
			'fuel'      => array(
				'type'    => 'select',
				'label'   => 'Fuel',
				'options' => array( 'Benzin', 'Diesel', 'Hybrid', 'Elektro' ),
			),
		);
	}

	public static function meta_key( string $field ): string {
		return '_lt_' . $field;
	}

	public static function lang_meta_key( string $field, string $lang ): string {
		return '_lt_' . $field . '_' . $lang;
	}

	public static function get_post_type( WP_Post $post ): string {
		return $post->post_type;
	}

	public static function is_vehicle_post( WP_Post $post ): bool {
		return in_array( $post->post_type, array( LTI_Post_Types::TRUCK, LTI_Post_Types::CAR ), true );
	}

	public static function save_vehicle( int $post_id, WP_Post $post ): void {
		if ( ! self::is_vehicle_post( $post ) ) {
			return;
		}

		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		if ( ! isset( $_POST['lti_vehicle_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['lti_vehicle_nonce'] ) ), 'lti_save_vehicle' ) ) {
			return;
		}

		$type_specific = LTI_Post_Types::TRUCK === $post->post_type
			? self::truck_field_defs()
			: self::car_field_defs();

		$all_fields = array_merge( self::shared_field_defs(), $type_specific );

		foreach ( $all_fields as $key => $def ) {
			$meta_key = self::meta_key( $key );
			$raw      = isset( $_POST[ 'lti_' . $key ] ) ? wp_unslash( $_POST[ 'lti_' . $key ] ) : '';

			switch ( $def['type'] ) {
				case 'number':
					update_post_meta( $post_id, $meta_key, absint( $raw ) );
					break;
				case 'checkbox':
					update_post_meta( $post_id, $meta_key, ! empty( $raw ) ? '1' : '0' );
					break;
				case 'textarea':
					update_post_meta( $post_id, $meta_key, sanitize_textarea_field( $raw ) );
					break;
				default:
					update_post_meta( $post_id, $meta_key, sanitize_text_field( $raw ) );
			}
		}

		foreach ( self::LANGS as $lang ) {
			foreach ( array( 'title', 'description', 'features' ) as $field ) {
				$input_key = 'lti_' . $field . '_' . $lang;
				$raw       = isset( $_POST[ $input_key ] ) ? wp_unslash( $_POST[ $input_key ] ) : '';

				if ( 'description' === $field ) {
					$value = wp_kses_post( $raw );
				} elseif ( 'features' === $field ) {
					$value = sanitize_textarea_field( $raw );
				} else {
					$value = sanitize_text_field( $raw );
				}

				update_post_meta( $post_id, self::lang_meta_key( $field, $lang ), $value );
			}
		}

		$external_id = get_post_meta( $post_id, self::meta_key( 'external_id' ), true );
		if ( empty( $external_id ) ) {
			$prefix = LTI_Post_Types::TRUCK === $post->post_type ? 't-' : 'c-';
			update_post_meta( $post_id, self::meta_key( 'external_id' ), $prefix . $post_id );
		}
	}

	public static function get_meta_value( int $post_id, string $field ) {
		return get_post_meta( $post_id, self::meta_key( $field ), true );
	}

	public static function get_lang_value( int $post_id, string $field, string $lang ): string {
		$value = get_post_meta( $post_id, self::lang_meta_key( $field, $lang ), true );
		return is_string( $value ) ? $value : '';
	}

	public static function parse_features( string $raw ): array {
		if ( empty( $raw ) ) {
			return array();
		}

		$lines = preg_split( '/\r\n|\r|\n/', $raw );
		$out   = array();

		foreach ( $lines as $line ) {
			$line = trim( $line );
			if ( '' !== $line ) {
				$out[] = $line;
			}
		}

		return $out;
	}

	public static function get_image_urls( int $post_id ): array {
		$urls = array();

		$thumb_id = get_post_thumbnail_id( $post_id );
		if ( $thumb_id ) {
			$thumb_url = wp_get_attachment_image_url( $thumb_id, 'full' );
			if ( $thumb_url ) {
				$urls[] = $thumb_url;
			}
		}

		$raw = (string) self::get_meta_value( $post_id, 'image_urls' );
		foreach ( self::parse_features( $raw ) as $url ) {
			$url = esc_url_raw( $url );
			if ( $url && ! in_array( $url, $urls, true ) ) {
				$urls[] = $url;
			}
		}

		return $urls;
	}

	public static function get_localized_block( int $post_id, string $lang ): array {
		$title = self::get_lang_value( $post_id, 'title', $lang );
		if ( '' === $title ) {
			$title = self::get_lang_value( $post_id, 'title', 'de' );
		}
		if ( '' === $title ) {
			$title = get_the_title( $post_id );
		}

		$description = self::get_lang_value( $post_id, 'description', $lang );
		if ( '' === $description ) {
			$description = self::get_lang_value( $post_id, 'description', 'de' );
		}

		$features_raw = self::get_lang_value( $post_id, 'features', $lang );
		if ( '' === $features_raw ) {
			$features_raw = self::get_lang_value( $post_id, 'features', 'de' );
		}

		return array(
			'title'       => $title,
			'description' => $description,
			'features'    => self::parse_features( $features_raw ),
		);
	}
}
