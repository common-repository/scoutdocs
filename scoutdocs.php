<?php
/**
 * Plugin Name: ScoutDocs
 * Plugin URI:  https://wordpress.org/plugins/scoutdocs/
 * Description: Secure file sharing, on your own site.
 * Version:     1.5.0
 * Author:      ScoutDocs
 * Author URI:  https://scoutdocs.com/
 * License:     GPLv2+
 * Text Domain: scoutdocs
 * Domain Path: /languages
 *
 * @package scoutdocs\plugin
 */

/**
 * Copyright (c) 2017-2019 ScoutDocs LLC (email: info@scoutdocs.com)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2 or, at
 * your discretion, any later version, as published by the Free
 * Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

defined( 'WPINC' ) or die;

include( dirname( __FILE__ ) . '/lib/requirements-check.php' );

$scoutdocs_requirements_check = new ScoutDocs_Requirements_Check( array(
	'title' => 'ScoutDocs',
	'php'   => '5.4',
	'wp'    => '4.9',
	'file'  => __FILE__,
));

if ( $scoutdocs_requirements_check->passes() ) {
	// Pull in the plugin classes and initialize.
	include( dirname( __FILE__ ) . '/classes/plugin.php' );
	include( dirname( __FILE__ ) . '/classes/setting.php' );
	include( dirname( __FILE__ ) . '/classes/user.php' );
	include( dirname( __FILE__ ) . '/classes/api-response.php' );

	ScoutDocs_Plugin::start( __FILE__ )->load_hooks();
}

unset( $scoutdocs_requirements_check );
