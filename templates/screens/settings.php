<?php defined( 'WPINC' ) or die; ?>
<div class="wrap scoutdocs">
	<h1>ScoutDocs Settings</h1>

	<form method="post">
		<?= wp_nonce_field( self::SETTINGS_NONCE_ACTION, self::SETTINGS_NONCE_NAME, false ) ?>
		<table class="form-table">
			<tbody>
				<?= $this->setting('license_key')->setting_row() ?>
				<tr>
					<th scope="row"><label for="license-info">License Info</label></th>
					<td>
					<?php if ( $subscription ) { ?>
						<p>
						<b><?= __( 'Status:', 'scoutdocs' ); ?></b> <?= $subscription->license; ?><br />
						<?php if ( 'valid' === $subscription->license && 'invalid' !== $subscription->level ) { ?>
							<b><?= __( 'Level:', 'scoutdocs' ); ?></b> <?= $subscription->level; ?><br />
							<?php if ( 'starter' !== $subscription->level ) { ?>
								<b><?= __( 'Next Bill:', 'scoutdocs' ); ?></b> <?= $subscription->expires; ?><br />
							<?php } ?>
							<b><?= __( 'Usage:', 'scoutdocs' ); ?></b> <?= floor( 100 * ( $subscription->total_usage / $subscription->plan_usage_limit ) ) ; ?>% of <?= $this->get_size( $subscription->plan_usage_limit ); ?><br />
							<b><?= __( 'Domains:', 'scoutdocs' ); ?></b> <?= implode( ", ", $subscription->domains ); ?>
							</p>
							<?php if ( isset( $subscription->updated ) && $subscription->updated ) { ?>
								<?php if ( ( time() - $subscription->updated ) < 60 ) { ?>
								<p>
									<i>This info was refreshed just now.</i>
								</p>
								<?php } else { ?>
								<p>
									<i>This info was refreshed <?= human_time_diff( $subscription->updated ); ?> ago.</i>
								</p>
								<?php } ?>
							<?php } ?>
						<?php } ?>
					<?php } elseif ( ! empty( $license_key ) ) { ?>
						<p><?= __( 'The license key you provided is not valid.', 'scoutdocs' ); ?></p>
					<?php } ?>
					</td>
				</tr>
				<?php if ( 'valid' === $subscription->license && 'invalid' !== $subscription->level ) { ?>
					<?= $this->setting('documents_title')->setting_row() ?>
					<?= $this->setting('logo')->setting_row() ?>
					<?= $this->setting('url')->setting_row() ?>
				<?php } ?>
			</tbody>
		</table>
		<?= submit_button() ?>
	</form>

<?php
$invalid = ! $subscription || 'invalid' === $subscription->license;
$this->include_file( 'templates/screens/support.php', compact( 'invalid' ) );
?>

</div>

