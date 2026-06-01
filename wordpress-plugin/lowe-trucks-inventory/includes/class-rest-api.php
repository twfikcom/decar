<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class LTI_REST_API {

	public static function init(): void {
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
		add_filter( 'rest_pre_serve_request', array( __CLASS__, 'add_cors_headers' ), 10, 4 );
	}

	public static function add_cors_headers( $served, $result, $request, $server ) {
		$route = $request->get_route();
		if ( 0 === strpos( $route, '/lowe-trucks/v1' ) ) {
			header( 'Access-Control-Allow-Origin: *' );
			header( 'Access-Control-Allow-Methods: GET, OPTIONS' );
			header( 'Access-Control-Allow-Headers: Content-Type' );
		}
		return $served;
	}

	public static function register_routes(): void {
		register_rest_route(
			'lowe-trucks/v1',
			'/trucks',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'list_trucks' ),
				'permission_callback' => '__return_true',
				'args'                => self::lang_args(),
			)
		);

		register_rest_route(
			'lowe-trucks/v1',
			'/trucks/(?P<id>[a-zA-Z0-9\-]+)',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'get_truck' ),
				'permission_callback' => '__return_true',
				'args'                => array_merge(
					self::lang_args(),
					array(
						'id' => array(
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						),
					)
				),
			)
		);

		register_rest_route(
			'lowe-trucks/v1',
			'/cars',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'list_cars' ),
				'permission_callback' => '__return_true',
				'args'                => self::lang_args(),
			)
		);

		register_rest_route(
			'lowe-trucks/v1',
			'/cars/(?P<id>[a-zA-Z0-9\-]+)',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'get_car' ),
				'permission_callback' => '__return_true',
				'args'                => array_merge(
					self::lang_args(),
					array(
						'id' => array(
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						),
					)
				),
			)
		);

		register_rest_route(
			'lowe-trucks/v1',
			'/parts',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'list_parts' ),
				'permission_callback' => '__return_true',
				'args'                => self::lang_args(),
			)
		);
	}

	private static function lang_args(): array {
		return array(
			'lang' => array(
				'default'           => 'de',
				'type'              => 'string',
				'enum'              => LTI_Meta_Fields::LANGS,
				'sanitize_callback' => 'sanitize_text_field',
			),
		);
	}

	private static function normalize_lang( string $lang ): string {
		return in_array( $lang, LTI_Meta_Fields::LANGS, true ) ? $lang : 'de';
	}

	public static function list_trucks( WP_REST_Request $request ) {
		return self::list_vehicles( LTI_Post_Types::TRUCK, $request, 'format_truck' );
	}

	public static function get_truck( WP_REST_Request $request ) {
		return self::get_vehicle( LTI_Post_Types::TRUCK, $request, 'format_truck' );
	}

	public static function list_cars( WP_REST_Request $request ) {
		return self::list_vehicles( LTI_Post_Types::CAR, $request, 'format_car' );
	}

	public static function get_car( WP_REST_Request $request ) {
		return self::get_vehicle( LTI_Post_Types::CAR, $request, 'format_car' );
	}

	public static function list_parts( WP_REST_Request $request ) {
		$lang = self::normalize_lang( (string) $request->get_param( 'lang' ) );

		$query = new WP_Query(
			array(
				'post_type'      => LTI_Post_Types::PART,
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'orderby'        => 'date',
				'order'          => 'DESC',
			)
		);

		$items = array();
		foreach ( $query->posts as $post ) {
			$items[] = self::format_part( $post, $lang );
		}

		return rest_ensure_response( $items );
	}

	private static function list_vehicles( string $post_type, WP_REST_Request $request, string $formatter ) {
		$lang = self::normalize_lang( (string) $request->get_param( 'lang' ) );

		$query = new WP_Query(
			array(
				'post_type'      => $post_type,
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'orderby'        => 'date',
				'order'          => 'DESC',
			)
		);

		$items = array();
		foreach ( $query->posts as $post ) {
			$items[] = self::$formatter( $post, $lang );
		}

		return rest_ensure_response( $items );
	}

	private static function get_vehicle( string $post_type, WP_REST_Request $request, string $formatter ) {
		$lang = self::normalize_lang( (string) $request->get_param( 'lang' ) );
		$id   = (string) $request->get_param( 'id' );

		$post = self::find_by_external_id( $post_type, $id );
		if ( ! $post ) {
			return new WP_Error( 'not_found', __( 'Vehicle not found.', 'lowe-trucks-inventory' ), array( 'status' => 404 ) );
		}

		return rest_ensure_response( self::$formatter( $post, $lang ) );
	}

	private static function find_by_external_id( string $post_type, string $external_id ): ?WP_Post {
		$query = new WP_Query(
			array(
				'post_type'      => $post_type,
				'post_status'    => 'publish',
				'posts_per_page' => 1,
				'meta_query'     => array(
					array(
						'key'   => LTI_Meta_Fields::meta_key( 'external_id' ),
						'value' => $external_id,
					),
				),
			)
		);

		if ( ! empty( $query->posts[0] ) ) {
			return $query->posts[0];
		}

		$prefix = LTI_Post_Types::TRUCK === $post_type ? 't-' : 'c-';
		if ( 0 === strpos( $external_id, $prefix ) ) {
			$post_id = absint( substr( $external_id, strlen( $prefix ) ) );
			if ( $post_id > 0 ) {
				$post = get_post( $post_id );
				if ( $post instanceof WP_Post && $post->post_type === $post_type && 'publish' === $post->post_status ) {
					return $post;
				}
			}
		}

		return null;
	}

	private static function resolve_external_id( WP_Post $post ): string {
		$id = (string) LTI_Meta_Fields::get_meta_value( $post->ID, 'external_id' );
		if ( '' !== $id ) {
			return $id;
		}

		$prefix = LTI_Post_Types::TRUCK === $post->post_type ? 't-' : 'c-';
		return $prefix . $post->ID;
	}

	private static function format_truck( WP_Post $post, string $lang ): array {
		$localized = LTI_Meta_Fields::get_localized_block( $post->ID, $lang, $post->post_type );
		$images    = LTI_Meta_Fields::get_image_urls( $post->ID );
		$video_url = (string) LTI_Meta_Fields::get_meta_value( $post->ID, 'video_url' );

		if ( empty( $images ) ) {
			$images = array(
				'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
			);
		}

		$category = (string) LTI_Meta_Fields::get_meta_value( $post->ID, 'category' );
		$category = LTI_Vocabulary::validate_truck_category( $category );

		$condition = (string) LTI_Meta_Fields::get_meta_value( $post->ID, 'condition' );
		if ( ! in_array( $condition, array( 'Neu', 'Gebraucht' ), true ) ) {
			$condition = 'Gebraucht';
		}

		$transmission = (string) LTI_Meta_Fields::get_meta_value( $post->ID, 'transmission' );
		$transmission = LTI_Vocabulary::validate_transmission( $transmission );

		$fuel_economy = (string) LTI_Meta_Fields::get_meta_value( $post->ID, 'fuel_economy' );

		return array(
			'id'           => self::resolve_external_id( $post ),
			'title'        => $localized['title'],
			'description'  => $localized['description'],
			'features'     => $localized['features'],
			'brand'        => (string) LTI_Meta_Fields::get_meta_value( $post->ID, 'brand' ),
			'model'        => (string) LTI_Meta_Fields::get_meta_value( $post->ID, 'model' ),
			'year'         => (int) LTI_Meta_Fields::get_meta_value( $post->ID, 'year' ),
			'mileage'      => (int) LTI_Meta_Fields::get_meta_value( $post->ID, 'mileage' ),
			'price'        => (int) LTI_Meta_Fields::get_meta_value( $post->ID, 'price' ),
			'power'        => (int) LTI_Meta_Fields::get_meta_value( $post->ID, 'power' ),
			'condition'    => $condition,
			'transmission' => $transmission,
			'fuelEconomy'  => $fuel_economy,
			'category'     => $category,
			'images'       => $images,
			'videoUrl'     => $video_url,
			'featured'     => '1' === LTI_Meta_Fields::get_meta_value( $post->ID, 'featured' ),
			'i18n'         => self::build_i18n_block( $post->ID, $post->post_type ),
		);
	}

	private static function format_car( WP_Post $post, string $lang ): array {
		$localized = LTI_Meta_Fields::get_localized_block( $post->ID, $lang, $post->post_type );
		$images    = LTI_Meta_Fields::get_image_urls( $post->ID );
		$video_url = (string) LTI_Meta_Fields::get_meta_value( $post->ID, 'video_url' );

		if ( empty( $images ) ) {
			$images = array(
				'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
			);
		}

		$body_type = (string) LTI_Meta_Fields::get_meta_value( $post->ID, 'body_type' );
		if ( '' === $body_type ) {
			$body_type = 'Limousine';
		}

		$fuel = (string) LTI_Meta_Fields::get_meta_value( $post->ID, 'fuel' );
		if ( '' === $fuel ) {
			$fuel = 'Diesel';
		}

		$condition = (string) LTI_Meta_Fields::get_meta_value( $post->ID, 'condition' );
		if ( ! in_array( $condition, array( 'Neu', 'Gebraucht' ), true ) ) {
			$condition = 'Gebraucht';
		}

		$transmission = (string) LTI_Meta_Fields::get_meta_value( $post->ID, 'transmission' );
		$transmission = LTI_Vocabulary::validate_transmission( $transmission );

		$fuel_economy = (string) LTI_Meta_Fields::get_meta_value( $post->ID, 'fuel_economy' );

		return array(
			'id'           => self::resolve_external_id( $post ),
			'title'        => $localized['title'],
			'description'  => $localized['description'],
			'features'     => $localized['features'],
			'brand'        => (string) LTI_Meta_Fields::get_meta_value( $post->ID, 'brand' ),
			'model'        => (string) LTI_Meta_Fields::get_meta_value( $post->ID, 'model' ),
			'year'         => (int) LTI_Meta_Fields::get_meta_value( $post->ID, 'year' ),
			'mileage'      => (int) LTI_Meta_Fields::get_meta_value( $post->ID, 'mileage' ),
			'price'        => (int) LTI_Meta_Fields::get_meta_value( $post->ID, 'price' ),
			'power'        => (int) LTI_Meta_Fields::get_meta_value( $post->ID, 'power' ),
			'condition'    => $condition,
			'transmission' => $transmission,
			'fuelEconomy'  => $fuel_economy,
			'bodyType'     => $body_type,
			'fuel'         => $fuel,
			'images'       => $images,
			'videoUrl'     => $video_url,
			'featured'     => '1' === LTI_Meta_Fields::get_meta_value( $post->ID, 'featured' ),
			'i18n'         => self::build_i18n_block( $post->ID, $post->post_type ),
		);
	}

	private static function build_i18n_block( int $post_id, string $post_type ): array {
		$block = array();
		foreach ( LTI_Meta_Fields::LANGS as $lang ) {
			$block[ $lang ] = LTI_Meta_Fields::get_localized_block( $post_id, $lang, $post_type );
		}
		return $block;
	}

	private static function resolve_part_external_id( WP_Post $post ): string {
		$id = (string) LTI_Meta_Fields::get_meta_value( $post->ID, 'external_id' );
		if ( '' !== $id ) {
			return $id;
		}
		return 'p-' . $post->ID;
	}

	private static function part_primary_image_url( WP_Post $post ): string {
		$thumb_id = get_post_thumbnail_id( $post->ID );
		if ( $thumb_id ) {
			$url = wp_get_attachment_image_url( $thumb_id, 'large' );
			if ( $url ) {
				return $url;
			}
		}

		return 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80';
	}

	private static function format_part( WP_Post $post, string $lang ): array {
		$localized = LTI_Meta_Fields::get_localized_block( $post->ID, $lang, $post->post_type );

		return array(
			'id'          => self::resolve_part_external_id( $post ),
			'title'       => $localized['title'],
			'description' => $localized['description'],
			'imageUrl'    => self::part_primary_image_url( $post ),
		);
	}
}
