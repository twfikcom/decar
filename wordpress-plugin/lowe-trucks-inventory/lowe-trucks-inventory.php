<?php
/**
 * Plugin Name: Löwe Trucks Inventory
 * Plugin URI:  https://github.com/twfikcom/decar
 * Description: Manage Cars & Trucks inventory with DE/EN/AR content and REST API for the Next.js frontend.
 * Version:     1.3.0
 * Author:      Löwe Trucks
 * Text Domain: lowe-trucks-inventory
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'LTI_VERSION', '1.3.1' );
define( 'LTI_PLUGIN_FILE', __FILE__ );
define( 'LTI_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'LTI_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

require_once LTI_PLUGIN_DIR . 'includes/class-post-types.php';
require_once LTI_PLUGIN_DIR . 'includes/class-feature-options.php';
require_once LTI_PLUGIN_DIR . 'includes/class-vocabulary.php';
require_once LTI_PLUGIN_DIR . 'includes/class-meta-fields.php';
require_once LTI_PLUGIN_DIR . 'includes/class-admin-ui.php';
require_once LTI_PLUGIN_DIR . 'includes/class-admin-menu.php';
require_once LTI_PLUGIN_DIR . 'includes/class-rest-api.php';

final class Lowe_Trucks_Inventory {

	public static function init(): void {
		LTI_Post_Types::init();
		LTI_Meta_Fields::init();
		LTI_Admin_UI::init();
		LTI_Admin_Menu::init();
		LTI_REST_API::init();
	}

	public static function activate(): void {
		LTI_Post_Types::register();
		flush_rewrite_rules();
	}

	public static function deactivate(): void {
		flush_rewrite_rules();
	}
}

add_action( 'plugins_loaded', array( 'Lowe_Trucks_Inventory', 'init' ) );
register_activation_hook( __FILE__, array( 'Lowe_Trucks_Inventory', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'Lowe_Trucks_Inventory', 'deactivate' ) );
