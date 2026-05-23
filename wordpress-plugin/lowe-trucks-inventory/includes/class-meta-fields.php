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
			'video_url'   => array( 'type' => 'url', 'label' => 'YouTube video URL' ),
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
				case 'url':
					update_post_meta( $post_id, $meta_key, esc_url_raw( $raw ) );
					break;
				default:
					update_post_meta( $post_id, $meta_key, sanitize_text_field( $raw ) );
			}
		}

		$gallery_raw = isset( $_POST['lti_gallery_ids'] ) ? wp_unslash( $_POST['lti_gallery_ids'] ) : '';
		$gallery_ids = array();
		foreach ( explode( ',', (string) $gallery_raw ) as $part ) {
			$id = absint( trim( $part ) );
			if ( $id > 0 ) {
				$gallery_ids[] = $id;
			}
		}
		update_post_meta( $post_id, self::meta_key( 'gallery_ids' ), implode( ',', $gallery_ids ) );

		foreach ( self::LANGS as $lang ) {
			foreach ( array( 'title', 'description' ) as $field ) {
				$input_key = 'lti_' . $field . '_' . $lang;
				$raw       = isset( $_POST[ $input_key ] ) ? wp_unslash( $_POST[ $input_key ] ) : '';

				if ( 'description' === $field ) {
					$value = wp_kses_post( $raw );
				} else {
					$value = sanitize_text_field( $raw );
				}

				update_post_meta( $post_id, self::lang_meta_key( $field, $lang ), $value );
			}

			$feature_input = 'lti_feature_keys_' . $lang;
			$selected      = isset( $_POST[ $feature_input ] ) && is_array( $_POST[ $feature_input ] )
				? array_map( 'sanitize_key', wp_unslash( $_POST[ $feature_input ] ) )
				: array();

			update_post_meta( $post_id, self::lang_meta_key( 'feature_keys', $lang ), wp_json_encode( array_values( array_unique( $selected ) ) ) );
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

	public static function get_feature_keys( int $post_id, string $lang ): array {
		$raw = self::get_lang_value( $post_id, 'feature_keys', $lang );
		if ( '' === $raw ) {
			return array();
		}

		$decoded = json_decode( $raw, true );
		if ( ! is_array( $decoded ) ) {
			return array();
		}

		return array_values( array_filter( array_map( 'sanitize_key', $decoded ) ) );
	}

	public static function feature_labels_for_keys( string $post_type, string $lang, array $keys ): array {
		$groups = LTI_Feature_Options::groups_for_post_type( $post_type );
		$labels = array();

		foreach ( $keys as $key ) {
			foreach ( $groups as $group ) {
				if ( isset( $group['items'][ $key ][ $lang ] ) ) {
					$labels[] = $group['items'][ $key ][ $lang ];
					break;
				}
			}
		}

		return $labels;
	}

	public static function get_features( int $post_id, string $lang, string $post_type ): array {
		$keys = self::get_feature_keys( $post_id, $lang );
		if ( empty( $keys ) ) {
			$keys = self::get_feature_keys( $post_id, 'de' );
		}

		return self::feature_labels_for_keys( $post_type, $lang, $keys );
	}

	public static function get_gallery_ids( int $post_id ): array {
		$raw = (string) self::get_meta_value( $post_id, 'gallery_ids' );
		$ids = array();

		foreach ( explode( ',', $raw ) as $part ) {
			$id = absint( trim( $part ) );
			if ( $id > 0 ) {
				$ids[] = $id;
			}
		}

		return $ids;
	}

	public static function get_image_urls( int $post_id ): array {
		$urls = array();

		$thumb_id = get_post_thumbnail_id( $post_id );
		if ( $thumb_id ) {
			$thumb_url = wp_get_attachment_image_url( $thumb_id, 'large' );
			if ( $thumb_url ) {
				$urls[] = $thumb_url;
			}
		}

		foreach ( self::get_gallery_ids( $post_id ) as $attachment_id ) {
			if ( $attachment_id === (int) $thumb_id ) {
				continue;
			}
			$url = wp_get_attachment_image_url( $attachment_id, 'large' );
			if ( $url && ! in_array( $url, $urls, true ) ) {
				$urls[] = $url;
			}
		}

		return $urls;
	}

	public static function get_localized_block( int $post_id, string $lang, string $post_type ): array {
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

		return array(
			'title'       => $title,
			'description' => $description,
			'features'    => self::get_features( $post_id, $lang, $post_type ),
		);
	}
}
