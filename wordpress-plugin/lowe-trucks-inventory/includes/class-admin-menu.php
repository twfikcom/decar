<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class LTI_Admin_Menu {

	public static function init(): void {
		add_action( 'admin_menu', array( __CLASS__, 'register_menu' ) );
	}

	public static function register_menu(): void {
		add_menu_page(
			__( 'Löwe Inventory', 'lowe-trucks-inventory' ),
			__( 'Löwe Inventory', 'lowe-trucks-inventory' ),
			'edit_posts',
			'lti-dashboard',
			array( __CLASS__, 'render_dashboard' ),
			'dashicons-car',
			26
		);

		add_submenu_page(
			'lti-dashboard',
			__( 'Dashboard', 'lowe-trucks-inventory' ),
			__( 'Dashboard', 'lowe-trucks-inventory' ),
			'edit_posts',
			'lti-dashboard',
			array( __CLASS__, 'render_dashboard' )
		);

		add_submenu_page(
			'lti-dashboard',
			__( 'All Trucks', 'lowe-trucks-inventory' ),
			__( 'Trucks', 'lowe-trucks-inventory' ),
			'edit_posts',
			'edit.php?post_type=' . LTI_Post_Types::TRUCK
		);

		add_submenu_page(
			'lti-dashboard',
			__( 'Add Truck', 'lowe-trucks-inventory' ),
			__( 'Add Truck', 'lowe-trucks-inventory' ),
			'edit_posts',
			'post-new.php?post_type=' . LTI_Post_Types::TRUCK
		);

		add_submenu_page(
			'lti-dashboard',
			__( 'All Cars', 'lowe-trucks-inventory' ),
			__( 'Cars', 'lowe-trucks-inventory' ),
			'edit_posts',
			'edit.php?post_type=' . LTI_Post_Types::CAR
		);

		add_submenu_page(
			'lti-dashboard',
			__( 'Add Car', 'lowe-trucks-inventory' ),
			__( 'Add Car', 'lowe-trucks-inventory' ),
			'edit_posts',
			'post-new.php?post_type=' . LTI_Post_Types::CAR
		);

		add_submenu_page(
			'lti-dashboard',
			__( 'All spare parts', 'lowe-trucks-inventory' ),
			__( 'Spare parts', 'lowe-trucks-inventory' ),
			'edit_posts',
			'edit.php?post_type=' . LTI_Post_Types::PART
		);

		add_submenu_page(
			'lti-dashboard',
			__( 'Add spare part', 'lowe-trucks-inventory' ),
			__( 'Add spare part', 'lowe-trucks-inventory' ),
			'edit_posts',
			'post-new.php?post_type=' . LTI_Post_Types::PART
		);

		add_submenu_page(
			'lti-dashboard',
			__( 'REST API', 'lowe-trucks-inventory' ),
			__( 'REST API', 'lowe-trucks-inventory' ),
			'edit_posts',
			'lti-api',
			array( __CLASS__, 'render_api_page' )
		);
	}

	public static function count_posts( string $post_type ): int {
		$counts = wp_count_posts( $post_type );
		return isset( $counts->publish ) ? (int) $counts->publish : 0;
	}

	public static function render_dashboard(): void {
		$trucks = self::count_posts( LTI_Post_Types::TRUCK );
		$cars   = self::count_posts( LTI_Post_Types::CAR );
		$parts  = self::count_posts( LTI_Post_Types::PART );
		$base   = rest_url( 'lowe-trucks/v1/' );
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Löwe Trucks Inventory', 'lowe-trucks-inventory' ); ?></h1>
			<p><?php esc_html_e( 'Manage trucks, cars, and spare parts with German, English, and Arabic content from a single edit screen.', 'lowe-trucks-inventory' ); ?></p>

			<div class="lti-dashboard-cards">
				<div class="lti-card">
					<h2><?php esc_html_e( 'Trucks', 'lowe-trucks-inventory' ); ?></h2>
					<p class="lti-count"><?php echo esc_html( (string) $trucks ); ?></p>
					<p>
						<a class="button button-primary" href="<?php echo esc_url( admin_url( 'post-new.php?post_type=' . LTI_Post_Types::TRUCK ) ); ?>">
							<?php esc_html_e( 'Add Truck', 'lowe-trucks-inventory' ); ?>
						</a>
						<a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=' . LTI_Post_Types::TRUCK ) ); ?>">
							<?php esc_html_e( 'View all', 'lowe-trucks-inventory' ); ?>
						</a>
					</p>
				</div>
				<div class="lti-card">
					<h2><?php esc_html_e( 'Cars', 'lowe-trucks-inventory' ); ?></h2>
					<p class="lti-count"><?php echo esc_html( (string) $cars ); ?></p>
					<p>
						<a class="button button-primary" href="<?php echo esc_url( admin_url( 'post-new.php?post_type=' . LTI_Post_Types::CAR ) ); ?>">
							<?php esc_html_e( 'Add Car', 'lowe-trucks-inventory' ); ?>
						</a>
						<a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=' . LTI_Post_Types::CAR ) ); ?>">
							<?php esc_html_e( 'View all', 'lowe-trucks-inventory' ); ?>
						</a>
					</p>
				</div>
				<div class="lti-card">
					<h2><?php esc_html_e( 'Spare parts', 'lowe-trucks-inventory' ); ?></h2>
					<p class="lti-count"><?php echo esc_html( (string) $parts ); ?></p>
					<p>
						<a class="button button-primary" href="<?php echo esc_url( admin_url( 'post-new.php?post_type=' . LTI_Post_Types::PART ) ); ?>">
							<?php esc_html_e( 'Add spare part', 'lowe-trucks-inventory' ); ?>
						</a>
						<a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=' . LTI_Post_Types::PART ) ); ?>">
							<?php esc_html_e( 'View all', 'lowe-trucks-inventory' ); ?>
						</a>
					</p>
					<p class="description"><?php esc_html_e( 'Image + text only; listed on the Next.js Parts page (no per-part URL).', 'lowe-trucks-inventory' ); ?></p>
				</div>
			</div>
		</div>
		<?php
	}

	public static function render_api_page(): void {
		$site  = home_url();
		$base  = rest_url( 'lowe-trucks/v1/' );
		$langs = array( 'de', 'en', 'ar' );
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'REST API for Next.js', 'lowe-trucks-inventory' ); ?></h1>
			<p><?php esc_html_e( 'Use these endpoints from the Next.js frontend. Pass ?lang=de|en|ar to receive localized title, description, and features.', 'lowe-trucks-inventory' ); ?></p>

			<table class="widefat striped">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Endpoint', 'lowe-trucks-inventory' ); ?></th>
						<th><?php esc_html_e( 'Description', 'lowe-trucks-inventory' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><code><?php echo esc_html( $base ); ?>trucks?lang=de</code></td>
						<td><?php esc_html_e( 'List all published trucks', 'lowe-trucks-inventory' ); ?></td>
					</tr>
					<tr>
						<td><code><?php echo esc_html( $base ); ?>trucks/t-001?lang=en</code></td>
						<td><?php esc_html_e( 'Single truck by external ID', 'lowe-trucks-inventory' ); ?></td>
					</tr>
					<tr>
						<td><code><?php echo esc_html( $base ); ?>cars?lang=ar</code></td>
						<td><?php esc_html_e( 'List all published cars', 'lowe-trucks-inventory' ); ?></td>
					</tr>
					<tr>
						<td><code><?php echo esc_html( $base ); ?>cars/c-001?lang=de</code></td>
						<td><?php esc_html_e( 'Single car by external ID', 'lowe-trucks-inventory' ); ?></td>
					</tr>
					<tr>
						<td><code><?php echo esc_html( $base ); ?>parts?lang=en</code></td>
						<td><?php esc_html_e( 'List spare parts (image + localized title/description for the Parts page)', 'lowe-trucks-inventory' ); ?></td>
					</tr>
				</tbody>
			</table>

			<p><?php esc_html_e( 'Next.js calls these URLs periodically (see WORDPRESS_REVALIDATE_SECONDS on the frontend). No push or webhook from WordPress is needed.', 'lowe-trucks-inventory' ); ?></p>

			<h2><?php esc_html_e( 'Next.js configuration', 'lowe-trucks-inventory' ); ?></h2>
			<pre class="lti-code">WORDPRESS_API_URL=<?php echo esc_html( $site ); ?>
WORDPRESS_REVALIDATE_SECONDS=60</pre>

			<p><?php esc_html_e( 'Supported languages:', 'lowe-trucks-inventory' ); ?> <?php echo esc_html( implode( ', ', $langs ) ); ?></p>
		</div>
		<?php
	}
}
