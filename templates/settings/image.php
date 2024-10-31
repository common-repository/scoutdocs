<?php defined( 'WPINC' ) or die; ?>

<tr>
	<th scope="row"><label for="<?= esc_attr( $setting->get_full_name() ) ?>"><?= $setting->get_human_name() ?></label></th>
	<td>
		<?= $setting->get_data( 'prefix' ) ?><input id="<?= esc_attr( $setting->get_full_name() ) ?>" name="<?= esc_attr( $setting->get_full_name() ) ?>" type="text" id="<?= esc_attr( $setting->get_full_name() ) ?>" class="regular-text" value="<?= esc_attr( $setting->get_admin() ) ?>" placeholder="<?= esc_attr( $setting->get_data( 'placeholder' ) ) ?>" />
		<input type="button" class="scoutdocs-upload button-secondary" value="<?= __( 'Upload File', 'scoutdocs' ); ?>" data-media-title="<?= esc_attr( $setting->get_data()['media-title'] ); ?>" data-media-button-text="<?= esc_attr( $setting->get_data()['media-button-text'] ); ?>" data-insert-to-id="<?= esc_attr( $setting->get_full_name() ) ?>" /></span>
		<?= $description ?>
	</td>
</tr>
