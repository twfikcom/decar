<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class LTI_Post_Types {

	public const TRUCK = 'lt_truck';
	public const CAR   = 'lt_car';

	public static function init(): void {
		add_action( 'init', array( __CLASS__, 'register' ) );
	}

	public static function register(): void {
		register_post_type(
			self::TRUCK,
			array(
				'labels'              => array(
					'name'          => __( 'Trucks', 'lowe-trucks-inventory' ),
					'singular_name' => __( 'Truck', 'lowe-trucks-inventory' ),
					'add_new_item'  => __( 'Add New Truck', 'lowe-trucks-inventory' ),
					'edit_item'     => __( 'Edit Truck', 'lowe-trucks-inventory' ),
					'search_items'  => __( 'Search Trucks', 'lowe-trucks-inventory' ),
				),
				'public'              => false,
				'show_ui'             => true,
				'show_in_menu'        => false,
				'show_in_rest'        => false,
				'capability_type'     => 'post',
				'map_meta_cap'        => true,
				'hierarchical'        => false,
				'supports'            => array( 'title', 'thumbnail' ),
				'has_archive'         => false,
				'rewrite'             => false,
			)
		);

		register_post_type(
			self::CAR,
			array(
				'labels'              => array(
					'name'          => __( 'Cars', 'lowe-trucks-inventory' ),
					'singular_name' => __( 'Car', 'lowe-trucks-inventory' ),
					'add_new_item'  => __( 'Add New Car', 'lowe-trucks-inventory' ),
					'edit_item'     => __( 'Edit Car', 'lowe-trucks-inventory' ),
					'search_items'  => __( 'Search Cars', 'lowe-trucks-inventory' ),
				),
				'public'              => false,
				'show_ui'             => true,
				'show_in_menu'        => false,
				'show_in_rest'        => false,
				'capability_type'     => 'post',
				'map_meta_cap'        => true,
				'hierarchical'        => false,
				'supports'            => array( 'title', 'thumbnail' ),
				'has_archive'         => false,
				'rewrite'             => false,
			)
		);
	}
}
