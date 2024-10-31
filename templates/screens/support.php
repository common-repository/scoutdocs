<?php defined( 'WPINC' ) or die; ?>
<div class="clearfix clear"></div>
<?php if ( $invalid ) { ?>
	<div>
	<?= __( '<p><b>Note:</b> You have not entered a valid license key above. ScoutDocs will not function without a valid license key.</p>'); ?>
	</div>
<?php } ?>

<hr />

<h3><?php _e( 'Support', 'scoutdocs' ) ?></h3>

<p class="support-message"></p>

<button class="show-support button button-primary"> <?php _e( 'Contact Support', 'scoutdocs' ) ?> </button>
<div class="loading"><?php _e( 'Loading&#8230;', 'scoutdocs' ) ?> </div>

<form method="post" action="" class="support hidden">
	<?php wp_nonce_field( self::SETTINGS_NONCE_ACTION, self::SETTINGS_NONCE_NAME, false ) ?>

	<table class="form-table">
		<tbody>
		<tr>
			<th scope="row"><label for="scoutdocs_name">Name</label></th>
			<td>
				<input name="scoutdocs_name" type="text" class="regular-text" value="<?= esc_attr( wp_get_current_user()->display_name ); ?>" placeholder="<?= esc_attr__( 'Enter your name', 'scoutdocs' ); ?>" required>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="scoutdocs_email">Email</label></th>
			<td>
				<input name="scoutdocs_email" type="email" class="regular-text regular-email" value="<?= esc_attr( wp_get_current_user()->user_email ); ?>" placeholder="<?= esc_attr__( 'Enter your email address', 'scoutdocs' ); ?>" required>
			</td>
		</tr>

		<tr>
			<th scope="row"><label for="scoutdocs_subject">Subject</label></th>
			<td>
				<input name="scoutdocs_subject" type="text" class="regular-text" placeholder="<?= esc_attr__( 'Briefly describe your issue', 'scoutdocs' ); ?>" value="" required>
			</td>
		</tr>

		<tr>
			<th scope="row"><label for="scoutdocs_body">Description</label></th>
			<td>
				<textarea name="scoutdocs_body" class="widefat" rows="10" required></textarea>
			</td>
		</tr>
		</tbody>
	</table>

	<p><b>Note:</b> ScoutDocs will receive diagnostic information about your web server and WordPress installation when you submit this request.<br /><a href="#" class="view-diagnostics">Preview diagnostic information</a></p>

	<?= submit_button( __( 'Send', 'scoutdocs' ), 'primary', 'support-submit', true ) ?>

	<div class="diagnostics-preview">
		<h3><?= _e( 'Diagnostic Information', 'scoutdocs' ); ?></h3>
		<div class="diagnostics"><?= esc_textarea( $this->get_system_information() ); ?></div>
	</div>
	<div class="clear"></div>
</form>


