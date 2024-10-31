<?php
/**
 * The ScoutDocs_User class.
 *
 * @package scoutdocs\plugin
 */

/**
 * Class for handling users.
 */
class ScoutDocs_User {
	/**
	 * The WP_User object for the user.
	 *
	 * @var WP_User
	 */
	protected $wp;

	const USER_ID = 'scoutdocs_user_id';
	const USER_KEY = 'scoutdocs_user_key';
	const VIEWED_DOCUMENTS = 'scoutdocs_viewed_documents';

	/**
	 * Constructs the object given a WordPress user object.
	 *
	 * @param WP_User $wp_user The WordPress user object.
	 */
	public function __construct( $wp_user ) {
		$this->update_wp( $wp_user );

		if ( ! $this->exists() ) {
			$this->api_create();
		}
	}

	/**
	 * Updates the WordPress user object
	 *
	 * @param WP_User $wp_user The WordPress user object.
	 */
	public function update_wp( $wp_user ) {
		if ( ! is_a( $wp_user, 'WP_User' ) ) {
			wp_die( '<code>ScoutDocs_User</code> must be passed a <code>WP_User</code> object.' );
		}

		$this->wp = $wp_user;
	}

	/**
	 * Constructs a ScoutDocs_User object from the current WordPress user.
	 *
	 * @return ScoutDocs_User An object for the current WordPress user.
	 */
	public static function current() {
		if ( did_action( 'init' ) ) {
			return new self( wp_get_current_user() );
		} else {
			wp_die( __( 'Cannot call <code>ScoutDocs_User::current()</code> before <code>init</code>.', 'scoutdocs' ) );
		}
	}

	/**
	 * Create a user given an array with 'name' / 'email' arguments.
	 *
	 * @param array $args Arguments for creating the user ('name' and 'email').
	 * @return ScoutDocs_User|WP_Error The resulting ScoutDocs_User object or WP_Error.
	 */
	public static function create( array $args ) {
		$user_args = [];

		$names = explode( ' ', $args['name'] );
		$first_name = array_shift( $names );
		$last_name = implode( ' ', $names );

		$root_user_login = sanitize_user( str_replace( ' ', '', $args['name'] ), true );
		$user_login = $root_user_login;
		$suffix = 1;

		if ( email_exists( $args['email'] ) ) {
			return new WP_Error( __( 'Email already exists', 'scoutdocs' ) );
		}

		// If necessary, add numbers to the end until it passes.
		while ( username_exists( $user_login ) && $suffix < 100 ) {
			$suffix++;
			$user_login = $root_user_login . $suffix;
		}

		// Limiting to 100 suffixes, and need to do a final check.
		if ( username_exists( $user_login ) || ! validate_username( $user_login ) ) {
			return new WP_Error( __( 'Invalid username', 'scoutdocs' ) );
		}

		$user_args['first_name'] = $first_name;
		$user_args['last_name'] = $last_name;
		$user_args['display_name'] = $args['name'];
		$user_args['user_email'] = $args['email'];
		$user_args['user_pass'] = wp_generate_password( 16 );
		$user_args['user_login'] = $user_login;
		$user_args['role'] = 'subscriber';

		$result = wp_insert_user( $user_args );

		if ( ! is_wp_error( $result ) ) {
			$result = self::get_by_id( $result );
		}

		return $result;
	}

	/**
	 * Constructs a ScoutDocs_User object from a given WordPress user ID.
	 *
	 * @param int $wp_user_id The WordPress user ID to look up.
	 * @return ScoutDocs_User|WP_Error A user object for that WordPress user ID.
	 */
	public static function get_by_id( $wp_user_id ) {
		$wp_user = get_user_by( 'id', $wp_user_id );
		if ( is_a( $wp_user, 'WP_User' ) ) {
			return new self( $wp_user );
		} else {
			return new WP_Error( __( 'user not found', 'scoutdocs' ) );
		}
	}

	/**
	 * Constructs a ScoutDocs_User object from a given WordPress login.
	 *
	 * @param string $wp_user_login The WordPress user login to look up.
	 * @return ScoutDocs_User|WP_Error A user object for that WordPress login.
	 */
	public static function get_by_login( $wp_user_login ) {
		$wp_user = get_user_by( 'login', $wp_user_login );
		if ( is_a( $wp_user, 'WP_User' ) ) {
			return new self( $wp_user );
		} else {
			return new WP_Error( __( 'user not found', 'scoutdocs' ) );
		}
	}

	/**
	 * Whether the user has been registered with ScoutDocs.
	 *
	 * @return bool Whether the user exists in the ScoutDocs API.
	 */
	public function exists() {
		return $this->get_sd_key() && $this->get_sd_id();
	}

	/**
	 * Returns the WordPress user object for the user.
	 *
	 * @return WP_User The WordPress user object for the user.
	 */
	public function wp() {
		return $this->wp;
	}

	/**
	 * Update the user's info.
	 *
	 * @param array $data The data to update (name, email).
	 * @return bool|WP_Error True on success, or WP_Error on failure.
	 */
	public function update( array $data ) {
		$updates = [];

		if ( isset( $data['name'] ) && trim( $data['name'] ) ) {
			$updates['display_name'] = trim( $data['name'] );
		}

		if ( isset( $data['email'] ) && is_email( $data['email'] ) ) {
			$updates['user_email'] = $data['email'];
		}

		if ( $updates ) {
			$updates['ID'] = (int) $this->wp()->ID;

			$result = wp_update_user( $updates );
			$this->update_wp( get_user_by( 'id', (int) $this->wp()->ID ) );

			if ( ! is_wp_error( $result ) ) {
				$result = true;
			}

			return $result;
		}

		return true;
	}

	/**
	 * Whether the user can do WordPress things.
	 *
	 * @return bool Whether the user can do WordPress things.
	 */
	public function can_do_wp_things() {
		return $this->wp()->has_cap( 'edit_posts' );
	}

	/**
	 * Whether the user can create users.
	 *
	 * @return bool Whether the user can create users.
	 */
	public function can_create_users() {
		return $this->wp->has_cap( 'create_users' );
	}

	/**
	 * Get a WordPress user meta value for the user.
	 *
	 * @param string $key The meta key.
	 * @return mixed The meta value.
	 */
	public function get_meta( $key ) {
		return get_user_meta( $this->wp()->ID, $key, true );
	}

	/**
	 * Sets user meta.
	 *
	 * @param string $key The meta key.
	 * @param mixed  $value The meta value.
	 */
	public function set_meta( $key, $value ) {
		return update_user_meta( $this->wp()->ID, $key, $value );
	}

	/**
	 * Returns the ScoutDocs user key.
	 *
	 * @return string The ScoutDocs user key.
	 */
	public function get_sd_key() {
		return $this->get_meta( self::USER_KEY );
	}

	/**
	 * Returns the ScoutDocs user ID.
	 *
	 * @return string The ScoutDocs user ID.
	 */
	public function get_sd_id() {
		return (int) $this->get_meta( self::USER_ID );
	}

	/**
	 * Sets the ScoutDocs user key.
	 *
	 * @param string $key The user key to set.
	 */
	public function set_sd_key( $key ) {
		return $this->set_meta( self::USER_KEY, $key );
	}

	/**
	 * Sets the ScoutDocs user ID.
	 *
	 * @param int $id The user ID to set.
	 */
	public function set_sd_id( $id ) {
		return $this->set_meta( self::USER_ID, (int) $id );
	}

	/**
	 * Creates the user in the API.
	 *
	 * @return bool Whether the user was created.
	 */
	public function api_create() {
		$site_key = get_option( 'scoutdocs_site_key' );

		if ( ! $site_key ) {
			return false;
		}

		$plugin = ScoutDocs_Plugin::get_instance();

		$result = $plugin->api_post( 'users', [
			'email' => $this->wp()->user_email,
			'username' => $this->wp()->user_login,
			'site_key' => $site_key,
		]);

		if ( $result->is_success() ) {
			$this->set_sd_key( $result->get_data( 'user_key' ) );
			$this->set_sd_id( $result->get_data( 'id' ) );
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Returns an API object for the user.
	 *
	 * @param array $additional_data Additional data to merge in.
	 *
	 * @return object An API object for the user.
	 */
	public function get_api_object( $additional_data = [] ) {
		$data = [
			'id' => $this->get_sd_id(), // Note, this is a ScoutDocs ID, not a WordPress ID.
			'name' => $this->wp()->display_name,
			'email' => $this->wp()->user_email,
		];

		return (object) array_merge( $data, $additional_data );
	}
}
