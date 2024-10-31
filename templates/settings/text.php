<?php defined( 'WPINC' ) or die; ?>

<tr>
	<th scope="row"><label for="<?= esc_attr( $setting->get_full_name() ) ?>"><?= $setting->get_human_name() ?></label></th>
	<td>
		<?= $setting->get_data( 'prefix' ) ?><input name="<?= esc_attr( $setting->get_full_name() ) ?>" type="text" id="<?= esc_attr( $setting->get_full_name() ) ?>" class="regular-text" value="<?= esc_attr( $setting->get_admin() ) ?>" placeholder="<?= esc_attr( $setting->get_data( 'placeholder' ) ) ?>" />
		<?= $description ?>
	</td>
</tr>
