<?php
/**
 * Predefined truck categories and vehicle brands (labels DE / EN / AR).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class LTI_Vocabulary {

	/**
	 * Stable category keys stored in post meta and exposed via REST (matches Next.js VehicleEnums).
	 * Order is used in admin dropdown.
	 */
	public static function truck_category_slugs(): array {
		return array( 'Sattelzugmaschine', 'Festaufbau', 'Kipper', 'Kastenwagen', 'Auflieger' );
	}

	/**
	 * @return array<string, array{de: string, en: string, ar: string}>
	 */
	public static function truck_categories(): array {
		return array(
			'Sattelzugmaschine' => array(
				'de' => 'Sattelzugmaschine',
				'en' => 'Tractor units',
				'ar' => 'رؤوس تريلات أو قاطرات',
			),
			'Festaufbau'        => array(
				'de' => 'LKW mit Aufbau / Koffer',
				'en' => 'Trucks with body',
				'ar' => 'شاحنات بصندوق مغلق',
			),
			'Kipper'            => array(
				'de' => 'Kipper',
				'en' => 'Dump trucks',
				'ar' => 'قلابات',
			),
			'Kastenwagen'       => array(
				'de' => 'Kastenwagen / Wechselbrücken-Fahrgestell',
				'en' => 'Demountable body / Chassis',
				'ar' => 'فانات مغلقة',
			),
			'Auflieger'         => array(
				'de' => 'Anhänger / Auflieger',
				'en' => 'Trailers',
				'ar' => 'مقطورات وأنصاف مقطورات',
			),
		);
	}

	/** @return string[] */
	public static function truck_brands(): array {
		return array( 'Mercedes-Benz', 'Volvo', 'Scania', 'MAN', 'Ford' );
	}

	/** @return string[] */
	public static function car_brands(): array {
		return array( 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi' );
	}

	/**
	 * Admin UI labels are always English so editors are not required to read German.
	 */
	public static function admin_lang(): string {
		return 'en';
	}

	/** @return array<string, string> */
	public static function condition_admin_labels(): array {
		return array(
			'Neu'       => 'New',
			'Gebraucht' => 'Used',
		);
	}

	/** @return array<string, string> */
	public static function body_type_admin_labels(): array {
		return array(
			'Limousine' => 'Sedan',
			'SUV'       => 'SUV',
			'Kombi'     => 'Estate',
			'Kompakt'   => 'Compact',
			'Coupé'     => 'Coupé',
		);
	}

	/** @return array<string, string> */
	public static function fuel_admin_labels(): array {
		return array(
			'Benzin'  => 'Petrol',
			'Diesel'  => 'Diesel',
			'Hybrid'  => 'Hybrid',
			'Elektro' => 'Electric',
		);
	}

	/** @return array<string, string> */
	public static function transmission_admin_labels(): array {
		return array(
			'Manual'    => 'Manual',
			'Automatic' => 'Automatic',
		);
	}

	public static function validate_transmission( string $value ): string {
		$value = trim( $value );
		return in_array( $value, array( 'Manual', 'Automatic' ), true ) ? $value : 'Automatic';
	}

	public static function truck_category_label( string $slug, ?string $lang = null ): string {
		$lang  = $lang ?? self::admin_lang();
		$all   = self::truck_categories();
		$labels = $all[ $slug ] ?? null;
		if ( ! is_array( $labels ) ) {
			return $slug;
		}
		return $labels[ $lang ] ?? $labels['de'];
	}

	public static function validate_truck_category( string $value ): string {
		$value = trim( $value );
		$allowed = self::truck_category_slugs();
		return in_array( $value, $allowed, true ) ? $value : 'Festaufbau';
	}

	public static function validate_brand( string $post_type, string $value ): string {
		$value   = trim( $value );
		$allowed = LTI_Post_Types::TRUCK === $post_type ? self::truck_brands() : self::car_brands();
		return in_array( $value, $allowed, true ) ? $value : ( $allowed[0] ?? '' );
	}
}
