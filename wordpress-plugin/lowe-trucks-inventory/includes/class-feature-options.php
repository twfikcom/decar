<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class LTI_Feature_Options {

	/**
	 * Feature groups for cars (reference: inventory plugin UI).
	 *
	 * @return array<string, array{label: array<string, string>, items: array<string, array<string, string>>}>
	 */
	public static function car_groups(): array {
		return array(
			'comfort' => array(
				'label' => array(
					'de' => 'Komfort',
					'en' => 'Comfort',
					'ar' => 'الراحة',
				),
				'items' => array(
					'ac_front'        => array( 'de' => 'Klimaanlage vorne', 'en' => 'A/C: Front', 'ar' => 'تكييف أمامي' ),
					'ac_rear'         => array( 'de' => 'Klimaanlage hinten', 'en' => 'A/C: Rear', 'ar' => 'تكييف خلفي' ),
					'backup_camera'   => array( 'de' => 'Rückfahrkamera', 'en' => 'Backup Camera', 'ar' => 'كاميرا خلفية' ),
					'cruise_control'  => array( 'de' => 'Tempomat', 'en' => 'Cruise Control', 'ar' => 'مثبت سرعة' ),
					'navigation'      => array( 'de' => 'Navigation', 'en' => 'Navigation', 'ar' => 'نظام ملاحة' ),
					'power_locks'     => array( 'de' => 'Zentralverriegelung', 'en' => 'Power Locks', 'ar' => 'قفل مركزي' ),
					'power_steering'  => array( 'de' => 'Servolenkung', 'en' => 'Power Steering', 'ar' => 'توجيه كهربائي' ),
				),
			),
			'entertainment' => array(
				'label' => array(
					'de' => 'Unterhaltung',
					'en' => 'Entertainment',
					'ar' => 'الترفيه',
				),
				'items' => array(
					'am_fm'      => array( 'de' => 'AM/FM Radio', 'en' => 'AM/FM Stereo', 'ar' => 'راديو AM/FM' ),
					'cd_player'  => array( 'de' => 'CD-Player', 'en' => 'CD Player', 'ar' => 'مشغل CD' ),
					'dvd'        => array( 'de' => 'DVD-System', 'en' => 'DVD System', 'ar' => 'نظام DVD' ),
					'mp3'        => array( 'de' => 'MP3-Player', 'en' => 'MP3 Player', 'ar' => 'مشغل MP3' ),
					'portable'   => array( 'de' => 'Portable Audio', 'en' => 'Portable Audio', 'ar' => 'صوت محمول' ),
					'premium'    => array( 'de' => 'Premium Audio', 'en' => 'Premium Audio', 'ar' => 'نظام صوت فاخر' ),
				),
			),
			'safety' => array(
				'label' => array(
					'de' => 'Sicherheit',
					'en' => 'Safety',
					'ar' => 'السلامة',
				),
				'items' => array(
					'airbag_driver'    => array( 'de' => 'Airbag Fahrer', 'en' => 'Airbag: Driver', 'ar' => 'وسادة هوائية للسائق' ),
					'airbag_passenger' => array( 'de' => 'Airbag Beifahrer', 'en' => 'Airbag: Passenger', 'ar' => 'وسادة هوائية للراكب' ),
					'abs'              => array( 'de' => 'ABS', 'en' => 'Antilock Brakes', 'ar' => 'ABS' ),
					'bluetooth'        => array( 'de' => 'Bluetooth', 'en' => 'Bluetooth', 'ar' => 'بلوتوث' ),
					'fog_lights'       => array( 'de' => 'Nebelscheinwerfer', 'en' => 'Fog Lights', 'ar' => 'أضواء ضباب' ),
					'hands_free'       => array( 'de' => 'Freisprecheinrichtung', 'en' => 'Hands-Free', 'ar' => 'Hands-Free' ),
					'security'         => array( 'de' => 'Alarmanlage', 'en' => 'Security System', 'ar' => 'نظام أمان' ),
				),
			),
			'seats' => array(
				'label' => array(
					'de' => 'Sitze',
					'en' => 'Seats',
					'ar' => 'المقاعد',
				),
				'items' => array(
					'bucket'   => array( 'de' => 'Sportsitze', 'en' => 'Bucket Seats', 'ar' => 'مقاعد رياضية' ),
					'heated'   => array( 'de' => 'Sitzheizung', 'en' => 'Heated Seats', 'ar' => 'مقاعد مدفأة' ),
					'leather'  => array( 'de' => 'Lederausstattung', 'en' => 'Leather Interior', 'ar' => 'تنجيد جلدي' ),
					'memory'   => array( 'de' => 'Memory-Sitze', 'en' => 'Memory Seats', 'ar' => 'مقاعد بذاكرة' ),
					'power'    => array( 'de' => 'Elektrische Sitze', 'en' => 'Power Seats', 'ar' => 'مقاعد كهربائية' ),
					'third_row'=> array( 'de' => '3. Sitzreihe', 'en' => 'Third Row Seats', 'ar' => 'صف مقاعد ثالث' ),
				),
			),
			'windows' => array(
				'label' => array(
					'de' => 'Fenster',
					'en' => 'Windows',
					'ar' => 'النوافذ',
				),
				'items' => array(
					'power_windows' => array( 'de' => 'Elektrische Fensterheber', 'en' => 'Power Windows', 'ar' => 'نوافذ كهربائية' ),
					'rear_window'   => array( 'de' => 'Heckscheibe', 'en' => 'Rear Window', 'ar' => 'نافذة خلفية' ),
					'defroster'     => array( 'de' => 'Heckscheibenheizung', 'en' => 'Windows Defroster', 'ar' => 'مزيل صقيع' ),
					'tinted'        => array( 'de' => 'Getönte Scheiben', 'en' => 'Wiper Tinted Glass', 'ar' => 'زجاج معتم' ),
				),
			),
			'other' => array(
				'label' => array(
					'de' => 'Sonstiges',
					'en' => 'Other',
					'ar' => 'أخرى',
				),
				'items' => array(
					'alloy'   => array( 'de' => 'Leichtmetallfelgen', 'en' => 'Alloy Wheels', 'ar' => 'جنوط سبائك' ),
					'keyless' => array( 'de' => 'Keyless Entry', 'en' => 'Keyless Entry', 'ar' => 'دخول بدون مفتاح' ),
					'sunroof' => array( 'de' => 'Schiebedach', 'en' => 'Sunroof', 'ar' => 'فتحة سقف' ),
					'tow'     => array( 'de' => 'Anhängerkupplung', 'en' => 'Tow Package', 'ar' => 'حزمة سحب' ),
					'hitch'   => array( 'de' => 'Anhängerzugvorrichtung', 'en' => 'Trailer Hitch', 'ar' => 'خطاف مقطورة' ),
				),
			),
		);
	}

	/**
	 * Feature groups for trucks / commercial vehicles.
	 *
	 * @return array<string, array{label: array<string, string>, items: array<string, array<string, string>>}>
	 */
	public static function truck_groups(): array {
		return array(
			'cab' => array(
				'label' => array(
					'de' => 'Fahrerhaus',
					'en' => 'Cab & Comfort',
					'ar' => 'كابينة وراحة',
				),
				'items' => array(
					'ac'           => array( 'de' => 'Klimaanlage', 'en' => 'Air conditioning', 'ar' => 'تكييف' ),
					'standheizung' => array( 'de' => 'Standheizung', 'en' => 'Parking heater', 'ar' => 'سخان وقوف' ),
					'luftfed'      => array( 'de' => 'Luftfederung', 'en' => 'Air suspension', 'ar' => 'تعليق هوائي' ),
					'retarder'     => array( 'de' => 'Retarder', 'en' => 'Retarder', 'ar' => 'مثبط' ),
					'kamera'       => array( 'de' => 'Rückfahrkamera', 'en' => 'Reversing camera', 'ar' => 'كاميرا خلفية' ),
					'navi'         => array( 'de' => 'Navigation', 'en' => 'Navigation', 'ar' => 'ملاحة' ),
				),
			),
			'safety' => array(
				'label' => array(
					'de' => 'Sicherheit',
					'en' => 'Safety',
					'ar' => 'السلامة',
				),
				'items' => array(
					'abs_ebs'   => array( 'de' => 'ABS/EBS', 'en' => 'ABS/EBS', 'ar' => 'ABS/EBS' ),
					'esp'       => array( 'de' => 'ESP', 'en' => 'ESP', 'ar' => 'ESP' ),
					'spurhalte' => array( 'de' => 'Spurhalteassistent', 'en' => 'Lane assist', 'ar' => 'مساعد مسار' ),
					'tempomat'  => array( 'de' => 'Tempomat', 'en' => 'Cruise control', 'ar' => 'مثبت سرعة' ),
					'led'       => array( 'de' => 'LED-Scheinwerfer', 'en' => 'LED headlights', 'ar' => 'إضاءة LED' ),
				),
			),
			'chassis' => array(
				'label' => array(
					'de' => 'Fahrwerk & Aufbau',
					'en' => 'Chassis & Body',
					'ar' => 'الهيكل والتجهيز',
				),
				'items' => array(
					'schwenk'  => array( 'de' => 'Schwenklenkachse', 'en' => 'Steering rear axle', 'ar' => 'محور خلفي قابل للتوجيه' ),
					'lift'     => array( 'de' => 'Liftachse', 'en' => 'Lift axle', 'ar' => 'محور رفع' ),
					'mega'     => array( 'de' => 'Mega / Low Roof', 'en' => 'Mega / low roof', 'ar' => 'سقف منخفض' ),
					'pritsche' => array( 'de' => 'Pritsche', 'en' => 'Flatbed', 'ar' => 'منصة' ),
					'kipper'   => array( 'de' => 'Kipper', 'en' => 'Tipper', 'ar' => 'قلاب' ),
					'kuehl'    => array( 'de' => 'Kühlaufbau', 'en' => 'Refrigerated body', 'ar' => 'هيكل مبرد' ),
				),
			),
			'other' => array(
				'label' => array(
					'de' => 'Sonstiges',
					'en' => 'Other',
					'ar' => 'أخرى',
				),
				'items' => array(
					'ahk'      => array( 'de' => 'Anhängerkupplung', 'en' => 'Tow hitch', 'ar' => 'خطاف سحب' ),
					'hybrid'   => array( 'de' => 'Hybridantrieb', 'en' => 'Hybrid drive', 'ar' => 'محرك هجين' ),
					'adblue'   => array( 'de' => 'AdBlue', 'en' => 'AdBlue', 'ar' => 'AdBlue' ),
					'retarder2'=> array( 'de' => 'Intarder', 'en' => 'Intarder', 'ar' => 'Intarder' ),
				),
			),
		);
	}

	public static function groups_for_post_type( string $post_type ): array {
		return LTI_Post_Types::TRUCK === $post_type ? self::truck_groups() : self::car_groups();
	}
}
