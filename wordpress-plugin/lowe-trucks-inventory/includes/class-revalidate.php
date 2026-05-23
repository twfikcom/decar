<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class LTI_Revalidate {

	public const OPTION_NEXTJS_URL    = 'lti_nextjs_url';
	public const OPTION_SECRET        = 'lti_revalidate_secret';

	public static function init(): void {
		add_action( 'save_post_' . LTI_Post_Types::TRUCK, array( __CLASS__, 'on_vehicle_change' ), 20, 3 );
		add_action( 'save_post_' . LTI_Post_Types::CAR, array( __CLASS__, 'on_vehicle_change' ), 20, 3 );
		add_action( 'transition_post_status', array( __CLASS__, 'on_status_change' ), 10, 3 );
		add_action( 'admin_init', array( __CLASS__, 'register_settings' ) );
		add_action( 'admin_menu', array( __CLASS__, 'register_settings_page' ) );
	}

	public static function register_settings(): void {
		register_setting( 'lti_revalidate', self::OPTION_NEXTJS_URL, array( 'sanitize_callback' => 'esc_url_raw' ) );
		register_setting( 'lti_revalidate', self::OPTION_SECRET, array( 'sanitize_callback' => 'sanitize_text_field' ) );
	}

	public static function register_settings_page(): void {
		add_submenu_page(
			'lti-dashboard',
			__( 'Next.js Sync', 'lowe-trucks-inventory' ),
			__( 'Next.js Sync', 'lowe-trucks-inventory' ),
			'manage_options',
			'lti-nextjs-sync',
			array( __CLASS__, 'render_settings_page' )
		);
	}

	public static function render_settings_page(): void {
		$nextjs_url = get_option( self::OPTION_NEXTJS_URL, 'https://löwetrucks.de' );
		$secret     = get_option( self::OPTION_SECRET, '' );
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Next.js cache sync', 'lowe-trucks-inventory' ); ?></h1>
			<p><?php esc_html_e( 'When you publish or update a vehicle, WordPress notifies the Next.js site to refresh its product cache immediately.', 'lowe-trucks-inventory' ); ?></p>

			<form method="post" action="options.php">
				<?php settings_fields( 'lti_revalidate' ); ?>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><label for="lti_nextjs_url"><?php esc_html_e( 'Next.js site URL', 'lowe-trucks-inventory' ); ?></label></th>
						<td>
							<input type="url" class="regular-text" id="lti_nextjs_url" name="<?php echo esc_attr( self::OPTION_NEXTJS_URL ); ?>" value="<?php echo esc_attr( $nextjs_url ); ?>" placeholder="https://löwetrucks.de">
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="lti_revalidate_secret"><?php esc_html_e( 'Revalidate secret', 'lowe-trucks-inventory' ); ?></label></th>
						<td>
							<input type="text" class="regular-text" id="lti_revalidate_secret" name="<?php echo esc_attr( self::OPTION_SECRET ); ?>" value="<?php echo esc_attr( $secret ); ?>" autocomplete="off">
							<p class="description"><?php esc_html_e( 'Must match REVALIDATE_SECRET in the Next.js .env on Hostinger.', 'lowe-trucks-inventory' ); ?></p>
						</td>
					</tr>
				</table>
				<?php submit_button(); ?>
			</form>

			<p>
				<button type="button" class="button" id="lti-test-revalidate"><?php esc_html_e( 'Test sync now', 'lowe-trucks-inventory' ); ?></button>
			</p>
			<pre id="lti-test-result" class="lti-code" style="display:none;"></pre>
			<script>
			document.getElementById('lti-test-revalidate')?.addEventListener('click', function () {
				const result = document.getElementById('lti-test-result');
				result.style.display = 'block';
				result.textContent = 'Sending…';
				fetch(ajaxurl + '?action=lti_test_revalidate', { credentials: 'same-origin' })
					.then(function (r) { return r.json(); })
					.then(function (data) { result.textContent = JSON.stringify(data, null, 2); })
					.catch(function (err) { result.textContent = String(err); });
			});
			</script>
		</div>
		<?php
	}

	public static function on_vehicle_change( int $post_id, WP_Post $post, bool $update ): void {
		unset( $update );
		if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
			return;
		}
		if ( 'publish' !== $post->post_status ) {
			return;
		}
		self::notify_nextjs( 'save', $post_id );
	}

	public static function on_status_change( string $new_status, string $old_status, WP_Post $post ): void {
		if ( ! in_array( $post->post_type, array( LTI_Post_Types::TRUCK, LTI_Post_Types::CAR ), true ) ) {
			return;
		}
		if ( $new_status === $old_status ) {
			return;
		}
		if ( 'publish' === $new_status || 'publish' === $old_status ) {
			self::notify_nextjs( 'status', $post->ID );
		}
	}

	public static function notify_nextjs( string $reason, int $post_id ): void {
		$base   = trim( (string) get_option( self::OPTION_NEXTJS_URL, '' ) );
		$secret = trim( (string) get_option( self::OPTION_SECRET, '' ) );

		if ( '' === $base || '' === $secret ) {
			return;
		}

		$url = rtrim( $base, '/' ) . '/api/revalidate?secret=' . rawurlencode( $secret );

		wp_remote_post(
			$url,
			array(
				'timeout'  => 15,
				'blocking' => false,
				'headers'  => array(
					'Accept'               => 'application/json',
					'x-revalidate-secret'  => $secret,
				),
			)
		);

		do_action( 'lti_nextjs_revalidate_requested', $reason, $post_id, $url );
	}

	public static function test_revalidate(): array {
		$base   = trim( (string) get_option( self::OPTION_NEXTJS_URL, '' ) );
		$secret = trim( (string) get_option( self::OPTION_SECRET, '' ) );

		if ( '' === $base || '' === $secret ) {
			return array(
				'ok'      => false,
				'message' => 'Configure Next.js URL and secret first.',
			);
		}

		$url  = rtrim( $base, '/' ) . '/api/revalidate?secret=' . rawurlencode( $secret );
		$resp = wp_remote_post(
			$url,
			array(
				'timeout' => 20,
				'headers' => array(
					'Accept'              => 'application/json',
					'x-revalidate-secret' => $secret,
				),
			)
		);

		if ( is_wp_error( $resp ) ) {
			return array(
				'ok'      => false,
				'message' => $resp->get_error_message(),
				'url'     => $url,
			);
		}

		$code = wp_remote_retrieve_response_code( $resp );
		$body = wp_remote_retrieve_body( $resp );

		return array(
			'ok'       => $code >= 200 && $code < 300,
			'status'   => $code,
			'response' => json_decode( $body, true ) ?: $body,
			'url'      => $url,
		);
	}
}

add_action(
	'wp_ajax_lti_test_revalidate',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => 'Forbidden' ), 403 );
		}
		wp_send_json_success( LTI_Revalidate::test_revalidate() );
	}
);
