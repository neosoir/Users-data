<?php

/**
 * Se activa en la activación del plugin
 *
 * @link       https://neoslab.online
 * @since      1.0.0
 *
 * @package    newtheme-blank
 * @subpackage newtheme-blank/includes
 */

/**
 * Ésta clase define todo lo necesario durante la activación del plugin
 *
 * @since      1.0.0
 * @package    newtheme-blank
 * @subpackage newtheme-blank/includes
 * @author     Neos Lab <contact@neoslab.online>
 */
class NEW_Activator {

	/**
	 * Método estático que se ejecuta al activar el plugin
	 *
	 * Creación de la tabla {$wpdb->prefix}newtheme_data
     * para guardar toda la información necesaria
	 *
	 * @since 1.0.0
     * @access public static
	 */
	public static function activate() {
        
        global $wpdb;

		$sql = "CREATE TABLE IF NOT EXISTS " . NEW_TABLE . " (
			id int(9) NOT NULL AUTO_INCREMENT,
			nombre varchar(70) NOT NULL,
			data longtext NOT NULL,
			PRIMARY KEY (id) );
        ";

		$wpdb->query( $sql );

	}

}





