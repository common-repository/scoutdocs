<?php
/**
 * The ScoutDocs_Plugin class.
 *
 * @package scoutdocs\plugin
 */

/**
 * The main ScoutDocs plugin class.
 */
class ScoutDocs_Plugin {

	/**
	 * The plugin singleton instance.
	 *
	 * @var ScoutDocs_Plugin
	 */
	protected static $instance;

	/**
	 * The main plugin file path.
	 *
	 * @var string
	 */
	protected $file;

	/**
	 * The plugin settings.
	 *
	 * @var array
	 */
	protected $settings;

	/**
	 * Whether the site info has been updated on this load.
	 *
	 * @var bool
	 */
	protected $did_site_update = false;

	/**
	 * The current SD user object.
	 *
	 * @var ScoutDocs_User
	 */
	protected $current_user;

	/**
	 * The scripts.
	 *
	 * @var WP_Scripts
	 */
	protected $scripts;

	/**
	 * The ScoutDocs server domain.
	 *
	 * @var string
	 */
	protected $server_domain = 'scoutdocs.com';

	const SETTINGS_NONCE_NAME = '_scoutdocs_nonce';
	const SETTINGS_NONCE_ACTION = 'scoutdocs-settings-update';
	const SUBSCRIPTION = 'scoutdocs_subscription';
	const VERSION = '1.5.0';
	const CSS_JS_VERSION = '1.5.0';

	/**
	 * Blank protected constructor.
	 */
	protected function __construct() {}

	/**
	 * Initializes the plugin object and returns its instance.
	 *
	 * @param string $file The main plugin file's __FILE__ value.
	 * @return ScoutDocs_Plugin The plugin object instance.
	 */
	public static function start( $file ) {
		if ( ! isset( static::$instance ) ) {
			static::$instance = new static();
			static::$instance->file = $file;
			static::$instance->init_settings();
		}

		return static::get_instance();
	}

	/**
	 * Returns the plugin's object instance.
	 *
	 * @return ScoutDocs_Plugin The plugin object instance.
	 */
	public static function get_instance() {
		if ( isset( static::$instance ) ) {
			return static::$instance;
		}
	}

	/**
	 * Add a WordPress hook (action/filter).
	 *
	 * @param mixed $hook first parameter is the name of the hook. If second or third parameters are included, they will be used as a priority (if an integer) or as a class method callback name (if a string).
	 */
	public function hook( $hook ) {
		$priority = 10;
		$method = $this->sanitize_method( $hook );
		$args = func_get_args();
		unset( $args[0] );
		foreach ( (array) $args as $arg ) {
			if ( is_int( $arg ) ) {
				$priority = $arg;
			} else {
				$method = $arg;
			}
		}

		return add_action( $hook, [ $this, $method ], $priority, 999 );
	}

	/**
	 * Sanitizes method names with bad characters.
	 *
	 * @param string $method The raw method name.
	 * @return string The sanitized method name.
	 */
	private function sanitize_method( $method ) {
		return str_replace( [ '.', '-' ], [ '_DOT_', '_DASH_' ], $method );
	}

	/**
	 * Includes a file (relative to the plugin base path)
	 * and optionally globalizes a named array passed in.
	 *
	 * @param string $file The file to include.
	 * @param array  $data A named array of data to globalize.
	 */
	public function include_file( $file, $data = [] ) {
		extract( $data, EXTR_SKIP );
		include( $this->get_path() . $file );
	}

	/**
	 * Returns the URL to the plugin's directory.
	 *
	 * @return string The URL to the plugin's directory.
	 */
	public function get_url() {
		return plugin_dir_url( $this->file );
	}

	/**
	 * Returns the path to the plugin directoryl
	 *
	 * @return string The absolute path to the plugin directory.
	 */
	public function get_path() {
		return plugin_dir_path( $this->file );
	}

	/**
	 * Loads the plugin's translations.
	 *
	 * @param string $name The textdomain.
	 * @param string $path The relative path to the plugin file.
	 *
	 * @return bool Whether translations were successfully loaded.
	 */
	public function load_textdomain( $name, $path ) {
		return load_plugin_textdomain( $name, false, basename( dirname( $this->file ) ) . $path );
	}

	/**
	 * Initialize $this->scripts if it has not been set.
	 *
	 * @return WP_Scripts WP_Scripts instance.
	 */
	public function scripts() {
		if ( ! ( $this->scripts instanceof WP_Scripts ) ) {
			$this->scripts = new WP_Scripts();
		}

		return $this->scripts;
	}

	/**
	 * Sets the hooks to be loaded after `plugins_loaded`.
	 *
	 * This lets another plugin remove ALL our functionality by
	 * removing this single hook.
	 */
	public function load_hooks() {
		$this->hook( 'plugins_loaded', 'add_hooks' );
	}

	/**
	 * Adds hooks.
	 */
	public function add_hooks() {
		$this->hook( 'admin_init' );
		$this->hook( 'admin_menu' );
		$this->hook( 'init' );
		$this->hook( 'query_vars' );
		$this->hook( 'template_include' );
		$this->hook( 'current_screen', 'maybe_redirect_user_to_ui' );
		$this->hook( 'admin_enqueue_scripts' );
		$this->hook( 'wp_ajax_support_ticket' );
		$this->hook( 'profile_update' );
		$this->hook( 'admin_notices' );
		$this->hook( 'update_option_home', 'site_options_updated' );
		$this->hook( 'update_option_blogname', 'site_options_updated' );
		$this->hook( 'update_option_admin_email', 'site_options_updated' );
	}

	/**
	 * Adds our 'scoutdocs' query arg.
	 *
	 * @param array $vars An array of query vars.
	 * @return array Our modified array of query vars.
	 */
	public function query_vars( $vars ) {
		$vars[] = 'scoutdocs';

		return $vars;
	}

	/**
	 * Adds our rewrite rules and does other bootstrapping.
	 */
	public function init() {
		add_rewrite_rule(
			'^' . $this->setting( 'url' )->get() . '/?',
			'index.php?scoutdocs=1',
			'top'
		);
	}

	/**
	 * Loads ScoutDocs, interrupting the normal WordPress template loading process.
	 *
	 * @param string $template The current template.
	 * @return string $template The pass-through template.
	 */
	public function template_include( $template ) {
		// Bail if this isn't ScoutDocs.
		if ( ! get_query_var( 'scoutdocs' ) ) {
			return $template;
		}

		// We don't cache ScoutDocs pages.
		nocache_headers();

		// Require that the user be logged in.
		if ( ! is_user_logged_in() ) {
			auth_redirect();
			return $template;
		}

		$this->load_docs_page();

		return $template;
	}

	/**
	 * Gets info about the plugin subscription.
	 *
	 * @return Object|false subscription info or false for HTTP errors.
	 */
	public function _get_subscription() {
		$return = false;

		$response = $this->api_get( 'subscription/' . $this->setting( 'license_key' )->get() . '/' . parse_url( home_url(), PHP_URL_HOST ) );

		if ( ! $response->is_error() ) {
			$return = $response->get();
			$return->updated = time();
		}

		return $return;
	}

	/**
	 * Clears subscription cached info.
	 */
	public function flush_subscription_cache() {
		return delete_transient( self::SUBSCRIPTION );
	}

	/**
	 * Resets all user keys.
	 */
	public function flush_user_keys() {
		global $wpdb;

		$user_ids = $wpdb->get_col("
			SELECT user_id
			FROM $wpdb->usermeta
			WHERE meta_key IN( 'scoutdocs_user_key', 'scoutdocs_user_id' )
		");

		foreach ( (array) $user_ids as $user_id ) {
			delete_user_meta( $user_id, 'scoutdocs_user_key' );
			delete_user_meta( $user_id, 'scoutdocs_user_id' );
		}
	}

	/**
	 * Gets info about the plugin subscription, with caching.
	 *
	 * @return Object|false subscription info or false for HTTP errors.
	 */
	public function get_subscription() {
		$subscription = get_transient( self::SUBSCRIPTION );

		if ( ! $subscription ) {
			$subscription = $this->_get_subscription();
			if ( false === $subscription ) {
				// Cache the HTTP failure for 5 minutes.
				set_transient( self::SUBSCRIPTION, (object) [
					'error' => true,
				], 60 * 5 );
			} else {
				set_transient( self::SUBSCRIPTION, $subscription, DAY_IN_SECONDS );
			}
		}

		if ( ! $subscription || isset( $subscription->error ) ) {
			$subscription = (object) [
				'license' => 'invalid',
				'level' => 'invalid',
				'activations_left' => 0,
				'domains' => [],
			];
		}

		return $subscription;
	}

	/**
	 * Returns the e-mail addressed used for document notifications.
	 *
	 * @return string The admin e-mail address.
	 */
	public function get_notification_email() {
		return get_bloginfo( 'admin_email' );
	}

	/**
	 * Registers scripts and styles and loads the WordPress admin ones.
	 */
	public function admin_enqueue_scripts() {
		wp_register_script( 'scoutdocs-jquery-validate', $this->get_url() . 'js/vendor/jquery.validate.min.js', [ 'jquery' ], '1.0', true );

		wp_register_script( 'scoutdocs-support', $this->get_url() . 'js/support.min.js', [ 'scoutdocs-jquery-validate' ], self::CSS_JS_VERSION, true );

		wp_localize_script( 'scoutdocs-support', 'sdSupportVars', [
			'ajax_url' => admin_url( 'admin-ajax.php' ),
			'ajax_nonce' => wp_create_nonce( 'support-ajax-nonce' ),
			'messages' => (object) [
				'scoutdocs_name' => __( 'Please enter your name', 'scoutdocs' ),
				'scoutdocs_subject' => __( 'You must enter a subject', 'scoutdocs' ),
				'scoutdocs_body' => __( 'You must enter a description', 'scoutdocs' ),
				'scoutdocs_email' => __( 'Please enter a valid email address', 'scoutdocs' ),
			],
		] );

		wp_register_script( 'scoutdocs', $this->get_url() . 'js/scoutdocs.min.js', [ 'plupload' ], self::CSS_JS_VERSION );

		// CSS.
		wp_register_style( 'scoutdocs-support', $this->get_url() . 'css/scoutdocs.css', [], self::CSS_JS_VERSION );

		if ( isset( $_GET['page'] ) && 'scoutdocs' === $_GET['page'] ) {
			wp_enqueue_media();
			wp_enqueue_style( 'scoutdocs-support' );
			wp_enqueue_script( 'scoutdocs-support' );
		}
	}

	/**
	 * Adds the admin menus.
	 */
	public function admin_menu() {
		$settings_hook = add_options_page( __( 'ScoutDocs', 'scoutdocs' ), __( 'ScoutDocs', 'scoutdocs' ), 'manage_options', 'scoutdocs', [ $this, 'settings_page' ] );

		// Grab the documents menu title.
		$documents_title = $this->setting( 'documents_title' )->get();

		// Add the ScoutDocs main menu page. Note: using a dummy page callback function.
		$doc_hook = add_menu_page( $documents_title, $documents_title, 'read', 'scoutdocs-list', '__return_true', 'data:image/svg+xml;base64,' . base64_encode( file_get_contents( $this->get_path() . 'images/menu-icon.svg' ) ) );

		// This gets run when the settings page loads.
		$this->hook( 'load-' . $settings_hook, 'load_settings_page' );

		// This gets run when the documents page is loaded and intercepts the page loading process.
		$this->hook( 'load-' . $doc_hook, 'redirect_to_docs_page' );
	}

	/**
	 * Handle the Ajax request for support tickets.
	 */
	public function wp_ajax_support_ticket() {
		$post = stripslashes_deep( $_POST );

		if ( check_ajax_referer( 'support-ajax-nonce', '_scoutdocs_support_nonce', false ) ) {
			$result = $this->api_post( 'support', [
				'license_key' => $this->get_license_key(),
				'name'        => trim( $post['name'] ),
				'email'       => trim( $post['email'] ),
				'subject'     => trim( $post['subject'] ),
				'body'        => trim( $post['body'] ),
				'domain'      => parse_url( home_url(), PHP_URL_HOST ),
				'system_info' => $this->get_system_information(),
			]);

			if ( $result->is_error() ) {
				wp_send_json_error([
					'message' => __( 'We were not able to send your message.', 'scoutdocs' ) . ' ' . $result->get_error_message(),
				]);
			} else {
				wp_send_json_success([
					'message' => __( 'Your message was sent!', 'scoutdocs' ),
				]);
			}
			exit;
		} else {
			wp_send_json_error([
				'message' => __( 'Invalid nonce', 'scoutdocs' ),
			]);
		}
	}

	/**
	 * Prints Plupload settings for ScoutDocs uploads.
	 */
	public function admin_head() {
		$subscription = $this->get_subscription();
		if ( 'valid' !== $subscription->license ) {
			return;
		}

		$plupload_init = [
			'runtimes' => 'html5,silverlight,flash,html4',
			'browse_button' => 'plupload-browse-button',
			'container' => 'plupload-upload-ui',
			'drop_element' => 'drag-drop-area',
			'file_data_name' => 'async-upload',
			'multiple_queues' => true,
			'max_file_size' => absint( $subscription->plan_file_size_limit ),
			'url' => $this->get_api_url( 'documents' ),
			'flash_swf_url' => includes_url( 'js/plupload/plupload.flash.swf' ),
			'silverlight_xap_url' => includes_url( 'js/plupload/plupload.silverlight.xap' ),
			'filters' => (object) [
				'mime_types' => [
					[
						'title' => __( 'PDF Files', 'scoutdocs' ),
						'extensions' => 'pdf',
					],
					[
						'title' => __( 'Microsoft Word Files', 'scoutdocs' ),
						'extensions' => 'doc,docx',
					],
					[
						'title' => __( 'Microsoft Excel Files', 'scoutdocs' ),
						'extensions' => 'xls,xlsx',
					],
					[
						'title' => __( 'Microsoft PowerPoint Files', 'scoutdocs' ),
						'extensions' => 'ppt,pptx',
					],
					[
						'title' => __( 'Image Files', 'scoutdocs' ),
						'extensions' => 'jpg,jpeg,png,gif,svg,ai,psd,eps,tiff,tif',
					],
					[
						'title' => __( 'Text Files', 'scoutdocs' ),
						'extensions' => 'txt',
					],
					[
						'title' => __( 'Zip Archive Files', 'scoutdocs' ),
						'extensions' => 'zip',
					],
				],
			],
			'multipart' => true,
			'urlstream_upload' => true,
			'multi_selection' => false,
			'multipart_params' => [
				'user_key' => $this->current_user()->get_sd_key(),
			],
		];
		?>
		<script>
			var base_plupload_config = <?php echo json_encode( $plupload_init ); ?>;
		</script>
		<?php
	}

	/**
	 * Runs when the settings page is loaded (before any output).
	 */
	public function load_settings_page() {
		if ( isset( $_POST[ self::SETTINGS_NONCE_NAME ] ) && wp_verify_nonce( $_POST[ self::SETTINGS_NONCE_NAME ], self::SETTINGS_NONCE_ACTION ) ) {
			// Settings are being updated, and the nonce is valid.
			$this->process_settings_update( stripslashes_deep( $_POST ) );
			$this->flush_subscription_cache();
			$this->init_site();
			flush_rewrite_rules();
			wp_redirect( add_query_arg( 'updated', 'true' ) );
			exit;
		}
	}

	/**
	 * Get the license key.
	 *
	 * @return string The license key.
	 */
	public function get_license_key() {
		return $this->setting( 'license_key' )->get();
	}

	/**
	 * Set the license key.
	 *
	 * @param string $key The new license key.
	 */
	public function set_license_key( $key ) {
		return $this->setting( 'license_key' )->set( $key );
	}

	/**
	 * Get the current site key setting.
	 *
	 * @return string The site key.
	 */
	public function get_site_key() {
		return $this->setting( 'site_key' )->get();
	}

	/**
	 * Whether the site key exists.
	 *
	 * @return bool Whether the site key exists.
	 */
	public function has_site_key() {
		if ( empty( $this->get_site_key() ) ) {
			return false;
		}

		if ( empty( $this->get_license_key() ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Set the site key.
	 *
	 * @param string $key The new site key.
	 */
	public function set_site_key( $key ) {
		return $this->setting( 'site_key' )->set( $key );
	}

	/**
	 * Get the settings URL.
	 *
	 * @return string The settings URL.
	 */
	public function settings_url() {
		return admin_url( 'options-general.php?page=scoutdocs' );
	}

	/**
	 * Get the document list URL.
	 *
	 * @return string The document list URL.
	 */
	public function document_list_url() {
		return home_url( '/' . $this->setting('url')->get() . '/' );
	}

	/**
	 * Gets a file size with suffic
	 *
	 * @param int $bytes The number of bytes.
	 * @param int $precision How precise to be.
	 * @return string The bytes, formatted.
	 */
	public function get_size( $bytes, $precision = 0 ) {
		$bytes = intval( $bytes );
		$base = log( floatval( $bytes ), 1024 );
		$suffixes = [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];

		return round( pow( 1024, $base - floor( $base ) ), $precision ) . $suffixes[ floor( $base ) ];
	}

	/**
	 * Filters WP_Error objects out of an array.
	 *
	 * @param array $items An array of items.
	 * @return array The array, with WP_Error objects removed.
	 */
	public function exclude_errors( array $items ) {
		return array_filter( $items, function( $item ) {
			return ! is_wp_error( $item );
		});
	}

	/**
	 * Get the current action.
	 *
	 * @return string The current action.
	 */
	public function current_action() {
		return isset( $_REQUEST['action'] ) ? $_REQUEST['action'] : '';
	}

	/**
	 * Runs when the document list page is loaded.
	 */
	public function load_docs_page() {
		$this->admin_enqueue_scripts();
		$action = $this->current_action();

		switch ( strtoupper( $_SERVER['REQUEST_METHOD'] ) . '-' . $action ) {

			// Updating the user's profile.
			case 'POST-profile':
				check_admin_referer( 'scoutdocs', '_sd_nonce' );
				$this->current_user()->update([
					'name' => stripslashes( $_REQUEST['userName'] ),
					'email' => stripslashes( $_REQUEST['userEmail'] ),
				]);

				echo json_encode( (object) [
					'success' => true,
					'data' => $this->current_user()->get_api_object(),
				]);
				die;
				break;

			// Creating a user.
			case 'POST-create-user':
				check_admin_referer( 'scoutdocs', '_sd_nonce' );
				if ( ! current_user_can( 'create_users' ) ) {
					wp_die( __( 'You are not allowed to create new users.', 'scoutdocs' ) );
				}

				$result = ScoutDocs_User::create([
					'name' => stripslashes( $_REQUEST['userName'] ),
					'email' => stripslashes( $_REQUEST['userEmail'] ),
				]);

				if ( is_wp_error( $result ) ) {
					echo json_encode( (object) [
						'success' => false,
						'error' => $result->get_error_message(),
					]);
				} else {
					echo json_encode( (object) [
						'success' => true,
						'data' => $result->get_api_object(),
					]);
				}

				die;
				break;
		}

		// Still here? Bad action.
		if ( $action ) {
			wp_die( 'Unknown action' );
		}

		$this->include_file( 'templates/screens/documents/header.php', [
			'scripts' => [ 'scoutdocs' ],
		] );

		$page_title = $this->setting( 'documents_title' )->get();

		$subscription = $this->get_subscription();

		if ( 'invalid' === $subscription->license || ! $this->has_site_key() ) {
			if ( $this->current_user()->wp()->can( 'manage_options' ) ) {
				// translators: The placeholder is the URL to ScoutDocs settings.
				wp_die( sprintf( __( 'ScoutDocs needs a valid license key. Visit <a href="%s">ScoutDocs Settings</a> to provide one.', 'scoutdocs' ), $this->settings_url() ) );
			} else {
				wp_die( __( 'It appears there is an issue accessing your files. Contact your site administrator for assistance.', 'scoutdocs' ) );
			}
		}

		// React data.
		$state = (object) [
			// URLs.
			'urls' => (object) [
				'logOut' => html_entity_decode( wp_logout_url( home_url() ) ),
				'admin' => admin_url(),
				'scoutdocs' => $this->document_list_url(),
				'settings' => $this->settings_url(),
				'scoutdocsPath' => untrailingslashit( parse_url( $this->document_list_url(), PHP_URL_PATH ) ),
				'ajax' => admin_url( 'admin-ajax.php' ),
				'api' => $this->get_api_url(),
				'plugin' => $this->get_url(),
			],

			// Subscription.
			'subscription' => (object) [
				'license' => $subscription->license,
				'level' => $subscription->level,
				'readerLimit' => $subscription->reader_limit,
				'storageFull' => $subscription->total_usage > $subscription->plan_usage_limit,
			],

			// Text strings.
			'text' => (object) [
				'documents' => $page_title,
				'logOut'    => __( 'Log Out',                              'scoutdocs' ),
				'addFile'   => _x( 'Add',          'Add documents button', 'scoutdocs' ),
				'cancel'    => _x( 'Cancel',       'Add documents button', 'scoutdocs' ),
				'newDocs'   => _x( 'new',       '"3 new" documents badge', 'scoutdocs' ),
				'pageTitle' => $page_title,
				'colTitles' => (object) [
					'size'      => _x( 'Size',      'table column title', 'scoutdocs' ),
					'readers' => _x( 'Readers', 'table column title', 'scoutdocs' ),
					'modified'  => _x( 'Modified',  'table column title', 'scoutdocs' ),
					'title'     => _x( 'Title',     'table column title', 'scoutdocs' ),
				],
				'actionTitles' => (object) [
					'delete' => _x( 'Delete', 'document action link', 'scoutdocs' ),
					'edit'   => _x( 'Edit', 'document action link', 'scoutdocs' ),
					'assign' => _x( 'Assign', 'document action link', 'scoutdocs' ),
					'revoke' => _x( 'Revoke', 'document action link', 'scoutdocs' ),
				],
				'uploader' => (object) [
					'drag'        => __( 'Drag Files Here', 'scoutdocs' ),
					'drop'        => __( 'Drop Files', 'scoutdocs' ),
					'or'          => _x( 'or', 'Uploader: Drop files here - or - Select Files', 'scoutdocs' ),
					'selectFiles' => __( 'Select Files', 'scoutdocs' ),
				],
			],

			// Uploader settings.
			'uploader' => (object) [
				'text' => (object) [
					'drag'        => __( 'Drag Files Here', 'scoutdocs' ),
					'drop'        => __( 'Drop Files', 'scoutdocs' ),
					'or'          => _x( 'or', 'Uploader: Drop files here - or - Select Files', 'scoutdocs' ),
					'selectFiles' => __( 'Select Files', 'scoutdocs' ),
				],
			],

			// The version.
			'version' => self::VERSION,

			// Per page.
			'perPage' => 50,

			// Logo.
			'logo' => $this->setting( 'logo' )->get(),

			// ScoutDocs logo.
			'sdLogoUrl' => $this->get_url() . 'images/menu-icon.svg',

			// Basics
			'user' => $this->current_user()->get_api_object(),
			'docs' => [],
		];

		$doc_reader_statuses = (object) [];

		$docs_result = $this->api_get( 'documents', [
			'user_key' => $this->current_user()->get_sd_key(),
		])->get();

		if ( ! is_wp_error( $docs_result ) ) {
			$state->docs = array_map( function( $doc ) use( &$doc_reader_statuses ) {
				// Old API stuff that can probably go away soon.
				unset( $doc->created_date );
				unset( $doc->modified_date );

				$doc->acceptance = (bool) $doc->acceptance;
				$doc->author = $doc->author->id;

				$doc_reader_statuses->{$doc->id} = (object) [];

				$doc->readers = is_array( $doc->readers ) ? $doc->readers : [];
				$doc->groups = is_array( $doc->groups ) ? $doc->groups : [];

				$doc->readers = array_map( function( $r ) use( $doc, &$doc_reader_statuses ) {
					$doc_reader_statuses->{$doc->id}->{$r->id} = $r->status;
					unset( $r->status );
					return $r->id;
				}, $doc->readers );

				$doc->groups = array_map( function( $g ) {
					return $g->id;
				}, $doc->groups );

				return $doc;
			}, $docs_result );
		} elseif ( 'no-documents-for-user' !== $docs_result->get_error_code() ) {
			wp_die( __( 'It appears there is an issue accessing your files. Contact your site administrator for assistance.', 'scoutdocs' ) );
		}

		$state->docReaderStatuses = $doc_reader_statuses;

		// Form these data types with what we already have.
		$state->users = [ $this->current_user()->get_api_object() ];
		$state->groups = [];

		$wp_users = new WP_User_Query([
			'number' => -1,
		]);

		$sd_users = array_map( function( $user ) {
			return new ScoutDocs_User( $user );
		}, $wp_users->results );

		if ( $this->current_user()->can_do_wp_things() ) {
			$react_users = $sd_users;
			$apiGroups = $this->api_get( 'groups', [
				'user_key' => $this->current_user()->get_sd_key(),
			])->get();

			$apiGroups = is_array( $apiGroups ) ? $apiGroups : [];

			$state->groups = array_map( function( $group ) {
				$group->users = array_map( function( $user ) {
					return $user->id;
				}, $group->users );

				return $group;
			}, $apiGroups );
		} else {
			$react_users = array_filter( $sd_users, function( $user ) {
				return $user->can_do_wp_things() || $user->wp()->ID === $this->current_user()->wp()->ID;
			});
		}

		$state->users = array_values( array_map( function( $user ) {
			return $user->get_api_object();
		}, $react_users ) );

		$state->user->canDoWordPressThings = $this->current_user()->can_do_wp_things();
		$state->user->canCreateUsers = $this->current_user()->can_create_users();
		$state->user->key = $this->current_user()->get_sd_key();
		$state->user->nonce = wp_create_nonce( 'scoutdocs' );

		// Footer.
		$this->include_file( 'templates/screens/documents/footer.php', [
			'react_data' => $state,
		]);
		exit;
	}

	/**
	 * Fetches the current user's ScoutDocs_User object.
	 *
	 * @return ScoutDocs_User The current user's ScoutDocs_User object.
	 */
	public function current_user() {
		if ( ! isset( $this->current_user ) ) {
			$this->current_user = ScoutDocs_User::current();
		}

		return $this->current_user;
	}

	/**
	 * Prints admin notices.
	 */
	public function admin_notices() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$subscription = $this->get_subscription();

		$this->print_notice(
			'notice-error',
			__( 'ScoutDocs is shutting down. Please save copies of all documents you have uploaded to ScoutDocs, and deactivate the plugin.', 'scoutdocs' )
		);

		if ( 'invalid' === $subscription->license ) {
			if ( 'settings_page_scoutdocs' === get_current_screen()->id ) {
				$this->print_notice(
					'notice-error',
					__( 'ScoutDocs needs a valid license key.', 'scoutdocs' )
				);
			} else {
				$this->print_notice(
					'notice-error',
					// translators: The placeholder is the URL to ScoutDocs settings.
					sprintf( __( 'ScoutDocs needs a valid license key. Visit <a href="%s">ScoutDocs Settings</a> to get started.', 'scoutdocs' ), $this->settings_url() )
				);
			}
		} elseif ( 'expired' === $subscription->license ) {
			$this->print_notice(
				'notice-error',
				// translators: the placeholder is a link to the support page on ScoutDocs.com.
				sprintf( __( 'Your ScoutDocs subscription has expired. Visit <a href="%s">ScoutDocs.com</a> to re-activate your subscription.', 'scoutdocs' ), 'https://scoutdocs.com/account/' )
			);
		} elseif ( 'site_inactive' === $subscription->license ) {
			$this->print_notice(
				'notice-error',
				// translators: the first placeholder is a link to the support page on ScoutDocs.com.
				// translators: the second placeholder is a link to the ScoutDocs options page.
				sprintf( __( 'ScoutDocs is not activated for this domain, and you have no activations remaining. This can happen if you previously used this license key on another domain. To resolve this, head to <a href="%s">ScoutDocs.com/account/</a> &rarr; View Licenses &rarr; Manage Sites and deactivate the old site. When that is done, visit <a href="%s">Settings &rarr; ScoutDocs</a> and re-save your license key.', 'scoutdocs' ), 'https://scoutdocs.com/account/', $this->settings_url() )
			);
		} elseif( 'valid' === $subscription->license && ! $this->has_site_key() ) {
			$this->print_notice(
				'notice-error',
				// translators: The placeholder is the URL to ScoutDocs settings.
				sprintf( __( 'Something went wrong. Your ScoutDocs subscription appears valid, but some critical information has gone missing from your local site. Please try re-saving your license key on the <a href="%s">ScoutDocs Settings</a> page. If that does not clear this error, contact ScoutDocs support.', 'scoutdocs' ), $this->settings_url() )
			);
		}

		if ( ! get_option( 'permalink_structure' ) ) {
			$this->print_notice(
				'notice-error',
				sprintf( __( 'ScoutDocs requires pretty permalinks to be enabled. Visit <a href="%s">Settings &rarr; Permalinks</a> to configure them.' ), admin_url( 'options-permalink.php' ) )
			);
		}
	}

	/**
	 * Prints a single notice.
	 *
	 * @param string $notice_type The type of notice.
	 * @param string $message The message to print.
	 */
	public function print_notice( $notice_type, $message ) {
		?>
		<div data-dismissible="notice-one-forever" class="notice <?php echo sanitize_html_class( $notice_type ); ?> is-dismissible">
			<p><?php echo $message; ?></p>
		</div>
		<?php
	}

	/**
	 * Update ScoutDocs settings from a $_POST-like array.
	 *
	 * @param array $post A stripslashed array of settings updates.
	 */
	public function process_settings_update( $post ) {
		foreach ( $this->get_all_settings() as &$setting ) {
			$key = 'scoutdocs_' . $setting->get_name();
			if ( isset( $post[ $key ] ) ) {
				$setting->set( $post[ $key ] );
			}
		}
	}

	/**
	 * Initialize the site.
	 */
	public function init_site() {
		$license_key = $this->get_license_key();
		$subscription = $this->get_subscription();
		$site_key = $this->get_site_key();

		// Bail if there is no license key.
		if ( ! $license_key ) {

			// Kill their site key, too.
			if ( $site_key ) {
				$this->set_site_key( '' );
			}

			return;
		}

		// Bail if license is invalid.
		if ( 'invalid' === $subscription->license ) {
			return;
		}

		// Bail if no activations left.
		if ( 'no_activations_left' === $subscription->license ) {
			return;
		}

		// We we have a valid subscription and a site key, we're good.
		if ( 'valid' === $subscription->license && $this->has_site_key() ) {
			return;
		}

		$domain = parse_url( get_home_url(), PHP_URL_HOST );
		$title = get_bloginfo( 'name' );
		$url = $this->document_list_url();
		$email = $this->get_notification_email();

		if ( $license_key && ! empty( $license_key ) ) {
			$result = $this->api_post( 'sites', [
				'license_key' => $license_key,
				'title' => $title,
				'domain' => $domain,
				'url' => $url,
				'email' => $email,
				'site_key' => $this->setting( 'site_key' )->get(),
			]);

			if ( $result->is_success() ) {
				$this->set_site_key( $result->get_data( 'site_key' ) );
				$this->flush_user_keys();
				$this->flush_subscription_cache();
			}
		}
	}

	/**
	 * Updates the site info.
	 *
	 * @return bool Whether the update succeeded.
	 */
	public function update_site_info() {
		if ( ! $this->did_site_update && $this->has_site_key() ) {
			$domain = parse_url( get_site_url(), PHP_URL_HOST );
			$title = get_bloginfo( 'name' );
			$url = $this->document_list_url();
			$email = $this->get_notification_email();

			$result = $this->api_post( 'site', [
				'domain' => $domain,
				'title' => $title,
				'url' => $url,
				'email' => $email,
				'site_key' => $this->get_site_key(),
			]);

			$this->did_site_update = true;

			return $result->is_success();
		}

		return false;
	}

	/**
	 * Enqueues a site update to happen.
	 */
	public function site_options_updated() {
		$this->hook( 'shutdown', 'update_site_info' );
	}

	/**
	 * Displays the settings page.
	 */
	public function settings_page() {
		$this->include_file( 'templates/screens/settings.php', [
			'subscription' => $this->get_subscription(),
			'license_key' => $this->setting( 'license_key' )->get(),
		]);
	}

	/**
	 * Updates the user profile.
	 *
	 * @param int $user_id User ID to update.
	 *
	 * @return void
	 */
	public function profile_update( $user_id ) {
		$user = new ScoutDocs_User( get_user_by( 'id', $user_id ) );

		$result = $this->api_post( 'user/' . $user->get_sd_id(), [
			'email' => $user->wp()->user_email,
			'username' => $user->wp()->user_login,
			'user_key' => $user->get_sd_key(),
		]);
	}

	/**
	 * Initializes the plugin, registers textdomain, etc.
	 */
	public function admin_init() {
		$this->load_textdomain( 'scoutdocs', '/languages' );
		$this->init_site();
	}

	/**
	 * Redirects users who can't do WordPress things to the ScoutDocs UI.
	 *
	 * @param WP_Screen $screen The current WordPress screen.
	 */
	public function maybe_redirect_user_to_ui( $screen ) {
		$can_do_wp_things = $this->current_user()->can_do_wp_things();
		$is_on_scoutdocs_page = 'toplevel_page_scoutdocs-list' === $screen->base;
		if ( ! $can_do_wp_things && ! $is_on_scoutdocs_page ) {
			$this->redirect_to_docs_page();
		}
	}

	/**
	 * Redirects to the ScoutDocs UI.
	 */
	public function redirect_to_docs_page() {
		wp_redirect( $this->document_list_url() );
		exit;
	}

	/**
	 * Returns a ScoutDocs Server API URL.
	 *
	 * @param string $path The path you want, like 'support'.
	 *
	 * @return string The API URL.
	 */
	public function get_api_url( $path = '' ) {
		$prefix = 'https://' . trailingslashit( $this->server_domain ) . 'wp-json/scoutdocs/v1/';
		$path = trim( $path );
		$path = trim( $path, '/' );
		$path = str_replace( $prefix, '', $path );

		return $prefix . $path;
	}

	/**
	 * Performs an API request.
	 *
	 * @param string $method Type of request ('GET' or 'POST' or 'DELETE').
	 * @param string $path The relative path to the ScoutDocs API endpoint.
	 * @param array  $data The data to pass in the body of a POST request.
	 *
	 * @return ScoutDocs_API_Response A response object.
	 */
	public function api_request( $method = 'GET', $path = '', $data = [] ) {
		$url = $this->get_api_url( $path );

		$method = strtoupper( trim( $method ) );

		$timeout = 3;

		$localdev = preg_match( '#\.test$#', $this->server_domain );

		if ( $localdev ) {
			$url = preg_replace( '#^https://#', 'http://', $url );
		}

		if ( 'POST' === $method ) {
			$result = wp_remote_post( $url, [
				'timeout' => $timeout,
				'body' => $data,
			]);
		} else {
			$result = wp_remote_request( $url, [
				'method' => $method,
				'timeout' => $timeout,
			]);
		}

		return new ScoutDocs_API_Response( $result, $url );
	}

	/**
	 * Performs a GET-based API request.
	 *
	 * @param string $path The relative path to the ScoutDocs API endpoint.
	 * @param array  $args Additional args to add to the endpoint as a query string.
	 *
	 * @return ScoutDocs_API_Response A response object.
	 */
	public function api_get( $path, $args = [] ) {
		$path = add_query_arg( $args, $path );

		return $this->api_request( 'GET', $path );
	}

	/**
	 * Performs a POST-based API request.
	 *
	 * @param string $path The relative path to the ScoutDocs API endpoint.
	 * @param array  $data The body data to pass in.
	 *
	 * @return ScoutDocs_API_Response A response object.
	 */
	public function api_post( $path, $data = [] ) {
		return $this->api_request( 'POST', $path, $data );
	}

	/**
	 * Performs a DELETE-based API request.
	 *
	 * @param string $path The relative path to the ScoutDocs API endpoint.
	 * @param array  $args Additional args to add to the endpoint as a query string.
	 *
	 * @return ScoutDocs_API_Response A response object.
	 */
	public function api_delete( $path, $args = [] ) {
		$path = add_query_arg( $args, $path );

		return $this->api_request( 'DELETE', $path );
	}

	/**
	 * Returns a ScoutDocs System Information.
	 *
	 * @return string The system information.
	 */
	public function get_system_information() {
		if ( ! class_exists( 'System_Data_Report' ) ) {
			$this->include_file( 'lib/system-data-report.php' );
		}

		return System_Data_Report::getInstance()->system_data();
	}

	/**
	 * Removes `scoutdocs_` from the beginning of a setting name.
	 *
	 * @param string $setting_name The potentially long-form setting name.
	 * @return string The shortened setting name.
	 */
	protected function simplify_setting_name( $setting_name ) {
		return preg_replace( '#^scoutdocs_#', '', $setting_name );
	}

	/**
	 * Initializes the plugin settings.
	 */
	protected function init_settings() {
		if ( defined( 'SCOUTDOCS_SERVER' ) ) {
			$this->server_domain = SCOUTDOCS_SERVER;
		}

		// license_key.
		$this->register_setting( new ScoutDocs_Setting( 'license_key', [
			'bundled' => false,
			'human_name' => __( 'ScoutDocs License Key', 'scoutdocs' ),
			'type' => 'license-key',
			'default' => '',
			'default_on_empty' => true,
			'description' => '<p class="description">If you already registered for a license key at ScoutDocs.com, enter it here.</p>',
		]));

		// site_key.
		$this->register_setting( new ScoutDocs_Setting( 'site_key', [
			'bundled' => false,
			'human_name' => __( 'ScoutDocs Site Key', 'scoutdocs' ),
			'type' => 'text',
			'default' => '',
			'default_on_empty' => true,
		]));

		// "ScoutDocs" menu and app name title.
		$this->register_setting( new ScoutDocs_Setting( 'documents_title', [
			'bundled' => false,
			'human_name' => __( 'Menu Title', 'scoutdocs' ),
			'type' => 'text',
			'default' => _x( 'ScoutDocs', 'the page and menu title', 'scoutdocs' ),
			'admin_default' => '',
			'default_on_empty' => true,
			'data' => [
				'placeholder' => _x( 'ScoutDocs', 'the page and menu title', 'scoutdocs' ),
			],
		]));

		// image.
		$this->register_setting( new ScoutDocs_Setting( 'logo', [
			'bundled' => false,
			'human_name' => __( 'Logo', 'scoutdocs' ),
			'type' => 'image',
			'default_on_empty' => true,
			'data' => [
				'media-title' => 'ScoutDocs Logo',
				'media-button-text' => 'Choose this Logo',
				'placeholder' => 'https://',
			],
		]));

		// URL slug.
		$this->register_setting( new ScoutDocs_Setting( 'url', [
			'bundled' => false,
			'human_name' => __( 'URL', 'scoutdocs' ),
			'type' => 'text',
			'default' => 'scoutdocs',
			'default_on_empty' => true,
			'description' => is_multisite() ? __( 'Please note that you should not use <code>files</code> on the main site of a Multisite WordPress install.', 'scoutdocs' ) : __( 'Make sure your choice of URL does not conflict with an existing post or page.', 'scoutdocs' ),
			'sanitize' => function( $value ) {
				$disallowed = [
					'page',
					'comments',
					'blog',
					// 'files',
					'feed',
					'wp-admin',
					'wp-content',
					'wp-includes',
					'wp-json',
					'embed',
				];
				$value = preg_replace( '#[^a-z0-9-]#', '', $value );
				return str_replace( $disallowed, '', $value );
			},
			'data' => [
				'placeholder' => 'scoutdocs',
				'prefix' => '<code>' . home_url( '/' ) . '</code>',
			],
		]));
	}

	/**
	 * Registers a setting.
	 *
	 * @param ScoutDocs_Setting $setting Registers a ScoutDocs setting.
	 */
	protected function register_setting( $setting ) {
		$this->settings[ $setting->get_name() ] = $setting;
	}

	/**
	 * Returns all ScoutDocs settings.
	 *
	 * @return array An array of ScoutDocs_Setting objects.
	 */
	protected function get_all_settings() {
		return $this->settings;
	}

	/**
	 * Gets a setting object.
	 *
	 * @param string $setting_name The name of the setting to fetch.
	 * @return ScoutDocs_Setting|false The setting object (or false).
	 */
	protected function setting( $setting_name ) {
		$setting_name = $this->simplify_setting_name( $setting_name );
		$all_settings = $this->get_all_settings();
		if ( isset( $all_settings[ $setting_name ] ) ) {
			return $all_settings[ $setting_name ];
		} else {
			return false;
		}
	}
}
