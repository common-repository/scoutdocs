<?php
/**
 * The ScoutDocs_Setting class.
 *
 * @package scoutdocs\plugin
 */

/**
 * Class for handling a ScoutDocs setting.
 */
class ScoutDocs_Setting {
	/**
	 * The name of the setting.
	 *
	 * @var string
	 */
	protected $name;

	/**
	 * Whether the setting is bundled into one settings array (otherwise standalone).
	 *
	 * @var bool
	 */
	protected $bundled = true;

	/**
	 * The data type of the setting.
	 *
	 * @var string
	 */
	protected $type = 'text';

	/**
	 * A human-readable name for the setting.
	 *
	 * @var string
	 */
	protected $human_name = '';

	/**
	 * Data attributes to use when displaying the setting.
	 *
	 * @var array
	 */
	protected $data = [];

	/**
	 * What to return if the value is false.
	 *
	 * @var mixed
	 */
	protected $default = false;

	/**
	 * What to return in the admin if the value is false.
	 *
	 * @var mixed
	 */
	protected $admin_default = false;

	/**
	 * Whether to use the default also for empty values.
	 *
	 * @var bool
	 */
	protected $default_on_empty = false;

	/**
	 * A sanitization function to pass get/set data through.
	 *
	 * @var callable
	 */
	protected $sanitize;


	/**
	 * A description to display under the option field.
	 *
	 * @var string
	 */
	protected $description;

	const ALL_OPTIONS_KEY = 'scoutdocs_settings';
	const FULL_NAME_PREFIX = 'scoutdocs_';

	/**
	 * Construct the setting object.
	 *
	 * @param string $name The name of the setting.
	 * @param array  $settings Settings for the setting.
	 */
	public function __construct( $name, array $settings ) {
		$this->name = $name;
		$defaults = [
			'bundled' => true,
			'type' => 'text',
			'human_name' => $name,
		];
		$settings = wp_parse_args( $settings, $defaults );

		if ( ! isset( $settings['admin_default'] ) && isset( $settings['default'] ) ) {
			$settings['admin_default'] = $settings['default'];
		}

		foreach ( $settings as $setting => $value ) {
			$this->$setting = $value;
		}
	}

	/**
	 * Get the name of the setting.
	 *
	 * @return string The name of the setting.
	 */
	public function get_name() {
		return $this->name;
	}

	/**
	 * The full name of the setting (with prefix).
	 *
	 * @return string The full name of the setting.
	 */
	public function get_full_name() {
		return self::FULL_NAME_PREFIX . $this->get_name();
	}

	/**
	 * The human-readable name of the setting.
	 *
	 * @return string The human-readable name of the setting.
	 */
	public function get_human_name() {
		return $this->human_name;
	}

	/**
	 * The description to display under the setting.
	 *
	 * @return string The description.
	 */
	public function get_description() {
		return (string) $this->description;
	}

	/**
	 * The data type of the setting.
	 *
	 * @return string The data type of the setting.
	 */
	public function get_type() {
		return preg_replace( '#[^a-z-]#', '', $this->type );
	}

	/**
	 * Gets the data pairs for this setting, or an individual value.
	 * @param string $key The key to get. Omit, for all.
	 * @return array|mixed The data pairs, or an individual value.
	 */
	public function get_data( $key = null ) {
		if ( is_null( $key ) ) {
			return $this->data;
		} elseif ( isset( $this->data[$key] ) ) {
			return $this->data[$key];
		} else {
			return null;
		}
	}

	/**
	 * Whether the setting is bundled into the main option.
	 *
	 * @return bool Whether the setting is bundled.
	 */
	public function is_bundled() {
		return (int) $this->bundled;
	}

	/**
	 * Returns the main option array (which contains bundled settings).
	 *
	 * @return array The main option array.
	 */
	protected function get_all_settings() {
		return get_option( self::ALL_OPTIONS_KEY, [] );
	}

	/**
	 * Updates the main option array (which contains bundled settings).
	 *
	 * @param array $settings The new values of the settings.
	 * @return bool The result of `update_option()`.
	 */
	protected function update_all_settings( $settings ) {
		return update_option( self::ALL_OPTIONS_KEY, $settings );
	}

	/**
	 * Gets the value of the setting for the admin.
	 *
	 * @return mixed The value of the setting (or admin default pass-through).
	 */
	public function get_admin() {
		return $this->get( $this->admin_default );
	}

	/**
	 * Gets the value of the setting.
	 *
	 * @param mixed $default The default value of the setting, if it does not exist.
	 * @return mixed The value of the setting (or default pass-through).
	 */
	public function get( $default = null ) {
		$default = is_null( $default ) ? $this->default : $default;
		$value = $default;

		// Get the value from the appropriate setting.
		if ( $this->is_bundled() ) {
			$all_settings = $this->get_all_settings();
			if ( isset( $all_settings[ $this->get_name() ] ) ) {
				$value = $all_settings[ $this->get_name() ];
			}
		} else {
			$value = get_option( $this->get_full_name(), $default );
		}

		// For default_on_empty settings, an empty value returns the default value.
		if ( $this->default_on_empty && empty( $value ) ) {
			$value = $default;
		}

		// Pass it through any sanitization callable that is defined.
		$value = $this->sanitize_value( $value );

		return $value;
	}

	/**
	 * Sanitizes a value according to the sanitize callable set.
	 *
	 * @param mixed $value The input value.
	 * @return mixed The sanitized value.
	 */
	public function sanitize_value( $value ) {
		if ( isset( $this->sanitize ) && is_callable( $this->sanitize ) ) {
			$value = call_user_func( $this->sanitize, $value );
		}

		return $value;
	}

	/**
	 * Sets the value of the setting.
	 *
	 * @param mixed $value The new value of the setting.
	 * @return bool The result of `update_option()`.
	 */
	public function set( $value ) {
		if ( is_string( $value ) ) {
			$value = trim( $value );
		}

		$value = $this->sanitize_value( $value );

		if ( $this->is_bundled() ) {
			$all_settings = $this->get_all_settings();
			$all_settings[ $this->get_name() ] = $value;
			return $this->update_all_settings( $all_settings );
		} else {
			return update_option( $this->get_full_name(), $value );
		}
	}

	/**
	 * Outputs the setting's form row.
	 */
	public function setting_row() {
		switch ( $this->get_type() ) {
			case 'text':
			case 'email':
			case 'hidden':
			case 'textarea':
			case 'license-key':
			case 'image':
				ScoutDocs_Plugin::get_instance()->include_file( 'templates/settings/' . $this->get_type() . '.php', [
					'setting' => $this,
					'description' => $this->get_description() ? '<p class="description">' . $this->get_description() . '</p>' : '',
				] );
				break;
			default:
				break;
		}
	}
}
