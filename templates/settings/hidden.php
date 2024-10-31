<?php defined( 'WPINC' ) or die; ?>
<input name="<?= esc_attr( $setting->get_full_name() ) ?>" id="<?= esc_attr( $setting->get_full_name() ) ?>" type="hidden" class="regular-hidden" value="<?= esc_attr( $setting->get_admin() ) ?>" />
