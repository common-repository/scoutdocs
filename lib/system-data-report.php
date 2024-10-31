<?php defined('WPINC') or die;

// Plugin Folder Path
if (!defined('SDP_DIR')) {
    define('SDP_DIR', plugin_dir_path(dirname(__FILE__)));
}

class System_Data_Report {

    /**
     * Static property to hold our singleton instance
     *
     * (default value: false)
     *
     * @var bool
     * @access public
     * @static
     */
    static $instance = false;

    /**
     * This is our constructor, which is private to force the use of
     * getInstance() to make this a Singleton
     *
     * @access private
     */
    private function __construct() { }

    /**
     * If an instance exists, this returns it.  If not, it creates one and
     * retuns it.
     *
     * @access public
     * @static
     * @return void
     */
    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new self;
        }
        return self::$instance;
    }

    /**
     * helper function for number conversions
     *
     * @access public
     * @param mixed $v
     * @return void
     */
    public function num_convt($v) {
        $l = substr($v, -1);
        $ret = substr($v, 0, -1);

        switch (strtoupper($l)) {
            case 'P': // fall-through
            case 'T': // fall-through
            case 'G': // fall-through
            case 'M': // fall-through
            case 'K': // fall-through
                $ret *= 1024;
                break;
            default:
                break;
        }

        return $ret;
    }

    /**
     * generate data for report
     *
     * @return System_system_report
     */
    public function system_data() {

        // call WP database
        global $wpdb;

        // check for browser class add on
        if (!class_exists('Browser')) {
            require_once SDP_DIR . 'lib/browser.php';
        }

        // do WP version check and get data accordingly
        $browser = new Browser();
        if (get_bloginfo('version') < '3.4') :
            $theme_data = get_theme_data(get_stylesheet_directory() . '/style.css');
            $theme = $theme_data['Name'] . ' ' . $theme_data['Version'];
        else:
            $theme_data = wp_get_theme();
            $theme = $theme_data->Name . ' ' . $theme_data->Version;
        endif;

        // data checks for later
        $frontpage = get_option('page_on_front');
        $frontpost = get_option('page_for_posts');
        $mu_plugins = get_mu_plugins();
        $plugins = get_plugins();
        $active = get_option('active_plugins', array());

        // multisite details
        $nt_plugins = is_multisite() ? wp_get_active_network_plugins() : array();
        $nt_active = is_multisite() ? get_site_option('active_sitewide_plugins', array()) : array();
        $ms_sites = is_multisite() ? get_blog_list() : null;

        // yes / no specifics
        $ismulti = is_multisite() ? __('Yes', 'system-data-report') : __('No', 'system-data-report');
        $safemode = ini_get('safe_mode') ? __('Yes', 'system-data-report') : __('No', 'system-data-report');
        $wpdebug = defined('WP_DEBUG') ? WP_DEBUG ? __('Enabled', 'system-data-report') : __('Disabled', 'system-data-report') : __('Not Set', 'system-data-report');
        $tbprefx = strlen($wpdb->prefix) < 16 ? __('Acceptable', 'system-data-report') : __('Too Long', 'system-data-report');
        $fr_page = $frontpage ? get_the_title($frontpage) . ' (ID# ' . $frontpage . ')' . '' : __('n/a', 'system-data-report');
        $fr_post = $frontpage ? get_the_title($frontpost) . ' (ID# ' . $frontpost . ')' . '' : __('n/a', 'system-data-report');
        $errdisp = ini_get('display_errors') != false ? __('On', 'system-data-report') : __('Off', 'system-data-report');

        $jquchk = wp_script_is('jquery', 'registered') ? $GLOBALS['wp_scripts']->registered['jquery']->ver : __('n/a', 'system-data-report');

        $sessenb = isset($_SESSION) ? __('Enabled', 'system-data-report') : __('Disabled', 'system-data-report');
        $usecck = ini_get('session.use_cookies') ? __('On', 'system-data-report') : __('Off', 'system-data-report');
        $useocck = ini_get('session.use_only_cookies') ? __('On', 'system-data-report') : __('Off', 'system-data-report');
        $hasfsock = function_exists('fsockopen') ? __('Your server supports fsockopen.', 'system-data-report') : __('Your server does not support fsockopen.', 'system-data-report');
        $hascurl = function_exists('curl_init') ? __('Your server supports cURL.', 'system-data-report') : __('Your server does not support cURL.', 'system-data-report');
        $hassoap = class_exists('SoapClient') ? __('Your server has the SOAP Client enabled.', 'system-data-report') : __('Your server does not have the SOAP Client enabled.', 'system-data-report');
        $hassuho = extension_loaded('suhosin') ? __('Your server has SUHOSIN installed.', 'system-data-report') : __('Your server does not have SUHOSIN installed.', 'system-data-report');
        $openssl = extension_loaded('openssl') ? __('Your server has OpenSSL installed.', 'system-data-report') : __('Your server does not have OpenSSL installed.', 'system-data-report');

        // start generating report
        $report = '';

        $report .= '### Begin System Info ###' . "\n";

        $report .= "\n\t" . '** WORDPRESS DATA **' . "\n";
        $report .= 'Multisite:' . "\t\t\t\t" . $ismulti . "\n";
        $report .= 'SITE_URL:' . "\t\t\t\t" . site_url() . "\n";
        $report .= 'HOME_URL:' . "\t\t\t\t" . home_url() . "\n";
        $report .= 'WP Version:' . "\t\t\t\t" . get_bloginfo('version') . "\n";
        $report .= 'Permalink:' . "\t\t\t\t" . get_option('permalink_structure') . "\n";
        $report .= 'Cur Theme:' . "\t\t\t\t" . $theme . "\n";
        $report .= 'Post Types:' . "\t\t\t\t" . implode(', ', get_post_types('', 'names')) . "\n";
        $report .= 'Post Stati:' . "\t\t\t\t" . implode(', ', get_post_stati()) . "\n";
        $report .= 'User Count:' . "\t\t\t\t" . count(get_users()) . "\n";

        $report .= "\n\t" . '** WORDPRESS CONFIG **' . "\n";
        $report .= 'WP_DEBUG:' . "\t\t\t\t" . $wpdebug . "\n";
        $report .= 'WP Memory Limit:' . "\t\t\t" . $this->num_convt(WP_MEMORY_LIMIT) / ( 1024 ) . 'MB' . "\n";
        $report .= 'Table Prefix:' . "\t\t\t\t" . $wpdb->base_prefix . "\n";
        $report .= 'Prefix Length:' . "\t\t\t\t" . $tbprefx . ' (' . strlen($wpdb->prefix) . ' characters)' . "\n";
        $report .= 'Show On Front:' . "\t\t\t\t" . get_option('show_on_front') . "\n";
        $report .= 'Page On Front:' . "\t\t\t\t" . $fr_page . "\n";
        $report .= 'Page For Posts:' . "\t\t\t\t" . $fr_post . "\n";

        if (is_multisite()) :
            $report .= "\n\t" . '** MULTISITE INFORMATION **' . "\n";
            $report .= 'Total Sites:' . "\t\t\t\t" . get_blog_count() . "\n";
            $report .= 'Base Site:' . "\t\t\t\t" . $ms_sites[0]['domain'] . "\n";
            $report .= 'All Sites:' . "\n";
            foreach ($ms_sites as $site) :
                if ($site['path'] != '/')
                    $report .= "\t\t" . '- ' . $site['domain'] . $site['path'] . "\n";

            endforeach;
            $report .= "\n";
        endif;

        $report .= "\n\t" . '** BROWSER DATA **' . "\n";
        $report .= 'Platform:' . "\t\t\t\t" . $browser->getPlatform() . "\n";
        $report .= 'Browser Name' . "\t\t\t\t" . $browser->getBrowser() . "\n";
        $report .= 'Browser Version:' . "\t\t\t" . $browser->getVersion() . "\n";
        $report .= 'Browser User Agent:' . "\t\t\t" . $browser->getUserAgent() . "\n";

        $report .= "\n\t" . '** SERVER DATA **' . "\n";
        $report .= 'jQuery Version' . "\t\t\t\t" . $jquchk . "\n";
        $report .= 'PHP Version:' . "\t\t\t\t" . PHP_VERSION . "\n";        
        $report .= 'MySQL Version:'."\t\t\t\t".esc_html( empty( $wpdb->use_mysqli ) ? mysql_get_server_info() : mysqli_get_server_info( $wpdb->dbh ) )."\n";
        $report .= 'Server Software:' . "\t\t\t" . $_SERVER['SERVER_SOFTWARE'] . "\n";

        $report .= "\n\t" . '** PHP CONFIGURATION **' . "\n";
        $report .= 'Safe Mode:' . "\t\t\t\t" . $safemode . "\n";
        $report .= 'Memory Limit:' . "\t\t\t\t" . ini_get('memory_limit') . "\n";
        $report .= 'Upload Max:' . "\t\t\t\t" . ini_get('upload_max_filesize') . "\n";
        $report .= 'Post Max:' . "\t\t\t\t" . ini_get('post_max_size') . "\n";
        $report .= 'Time Limit:' . "\t\t\t\t" . ini_get('max_execution_time') . "\n";
        $report .= 'Max Input Vars:' . "\t\t\t\t" . ini_get('max_input_vars') . "\n";
        $report .= 'Display Errors:' . "\t\t\t\t" . $errdisp . "\n";
        $report .= 'Sessions:' . "\t\t\t\t" . $sessenb . "\n";
        $report .= 'Session Name:' . "\t\t\t\t" . esc_html(ini_get('session.name')) . "\n";
        $report .= 'Cookie Path:' . "\t\t\t\t" . esc_html(ini_get('session.cookie_path')) . "\n";
        $report .= 'Save Path:' . "\t\t\t\t" . esc_html(ini_get('session.save_path')) . "\n";
        $report .= 'Use Cookies:' . "\t\t\t\t" . $usecck . "\n";
        $report .= 'Use Only Cookies:' . "\t\t\t" . $useocck . "\n";
        $report .= 'FSOCKOPEN:' . "\t\t\t\t" . $hasfsock . "\n";
        $report .= 'cURL:' . "\t\t\t\t\t" . $hascurl . "\n";
        $report .= 'SOAP Client:' . "\t\t\t\t" . $hassoap . "\n";
        $report .= 'SUHOSIN:' . "\t\t\t\t" . $hassuho . "\n";
        $report .= 'OpenSSL:' . "\t\t\t\t" . $openssl . "\n";

        $report .= "\n\t" . '** PLUGIN INFORMATION **' . "\n";
        if ($plugins && $mu_plugins) :
            $report .= 'Total Plugins:' . "\t\t\t\t" . ( count($plugins) + count($mu_plugins) + count($nt_plugins) ) . "\n";
        endif;

        // output must-use plugins
        if ($mu_plugins) :
            $report .= 'Must-Use Plugins: (' . count($mu_plugins) . ')' . "\n";
            foreach ($mu_plugins as $mu_path => $mu_plugin) :
                $report .= "\t" . '- ' . $mu_plugin['Name'] . ' ' . $mu_plugin['Version'] . "\n";
            endforeach;
            $report .= "\n";
        endif;

        // if multisite, grab active network as well
        if (is_multisite()) :
            // active network
            $report .= 'Network Active Plugins: (' . count($nt_plugins) . ')' . "\n";

            foreach ($nt_plugins as $plugin_path) :
                if (array_key_exists($plugin_base, $nt_plugins))
                    continue;

                $plugin = get_plugin_data($plugin_path);

                $report .= "\t" . '- ' . $plugin['Name'] . ' ' . $plugin['Version'] . "\n";
            endforeach;
            $report .= "\n";

        endif;

        // output active plugins
        if ($plugins) :
            $report .= 'Active Plugins: (' . count($active) . ')' . "\n";
            foreach ($plugins as $plugin_path => $plugin) :
                if (!in_array($plugin_path, $active))
                    continue;
                $report .= "\t" . '- ' . $plugin['Name'] . ' ' . $plugin['Version'] . "\n";
            endforeach;
            $report .= "\n";
        endif;

        // output inactive plugins
        if ($plugins) :
            $report .= 'Inactive Plugins: (' . ( count($plugins) - count($active) ) . ')' . "\n";
            foreach ($plugins as $plugin_path => $plugin) :
                if (in_array($plugin_path, $active))
                    continue;
                $report .= "\t" . '- ' . $plugin['Name'] . ' ' . $plugin['Version'] . "\n";
            endforeach;
            $report .= "\n";
        endif;

        // end it all
        $report .= "\n" . '### End System Info ###';

        return $report;
    }

/// end class
}
