<?php defined( 'WPINC' ) or die; ?><!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title><?= esc_html( $this->setting('documents_title')->get() ); ?></title>

	<!-- Pre-render styles, to minimize UI jitter -->
	<style>
		i.fa {display: inline-block;}
		td.doc-icon i.fa {width: 1.25em;}
		nav i.fa-wordpress-simple {width: 1em;}
		nav i.fa-chevron-left {width: 10px;}
		nav i.fa-archive {width: 1em;}
	</style>

	<?php wp_print_scripts( $scripts ); ?>
	<?php $this->admin_head(); ?>

	<link rel="stylesheet" href="<?= $this->get_url(); ?>css/app.css">
</head>
<body>
	<div id="scoutdocs-app">
		<div class="loading"><?= __( 'Loading&hellip;' ); ?></div>
	</div>
	<div id="modals"></div>
