<?php

/**
 * Se activa cuando el plugin va a ser desinstalado
 *
 * @link       https://neoslab.online
 * @since      1.0.0
 *
 * @package    users_data
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

/*
 * Agregar todo el código necesario
 * para eliminar ( como las bases de datos, limpiar caché,
 * limpiar enlaces permanentes, etc. ) en la desinstalación
 * del plugin
 */
global $wpdb;

$sql = "DROP TABLE IF EXISTS {$wpdb->prefix}newtheme_data";

$wpdb->query( $sql );


