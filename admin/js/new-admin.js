(function( $ ) {
	'use strict';

	/**
	 * Global varibles.
	 */
	var timer = 2000;

	var	preload 		= $('.preload'),
		urledit 		= "?page=new_data&accion=edit&id=",
		marcoImagen 	= $('.marcoImagen img'),
		marco,
		urlImgUser 		= $('#selectimgval'),
		idTable 		= $('#idTable').val();

	var nombres 		= $('#nombres'),
		apellidos 		= $('#apellidos'),
		email			= $('#email');

	/**
	 * Open modal.
	 */ 
	$(document).ready( function() {

		$('.modal').modal();

		$('.add-new-table').on('click', function(e) {
			e.preventDefault();
			$('#add_new_table').modal('open');
		});

	});

	/**
	 * Create table.
	 */
	$(document).ready( function() {

		$('#crear-tabla').on('click', function(e) {

			e.preventDefault();

			var nombre = $('#nombre-tabla');
			var n = nombre.val();
			var mensaje = $('#add_new_table #mensaje');

			if ( n != '' ) {
				
				// Envio ajax.
				mensaje.html('');
				// Preload
				preload.css('display', 'flex');

				$.ajax({
					url: newdata.url,
					type: 'POST',
					dataType: 'json',
					data: {
						action: 'new_crud_table',
						nonce: newdata.seguridad,
						nombre: n,
						tipo: 'add'
					},
					success: function( response ) {
						if ( response.result ) {
							
							urledit += response.insert_id
							setTimeout( function() {
								location.href = urledit;
							}, 1300 );
						}
					},
					error: function ( d, x, v ) {
						console.log( d );
						console.log( x );
						console.log( v );
					}
				});

			}
			else {

				if ( !nombre.hasClass('invalid') ) {
					
					// Preload
					preload.css('display', 'none');

					nombre.addClass('invalid');
					nombre.after('<p id="mensaje">Insertar nombre de la tabla.</p>')

				}

			}
		});

	});

	/**
	 * Delete table (use sweetalert).
	 */
	$(document).ready( function() {
		$('table').on('click', '[data-new-id-remove]', function() {

			var id 		= $(this).attr('data-new-id-remove');
			var nombre 	= $('#dataTable' + id + ' [data-new-name]').attr('data-new-name');



			swal({

				title: "¿Estás seguro?",
				text: "Una vez eliminada la tabla no podras recuperarla",
				icon: "warning",
				buttons: true,
				dangerMode: true,

			})
			.then((willDelete) => {

				if (willDelete) {

					$.ajax({
						url: 		newtabdelete.url,
						type: 		'POST',
						dataType: 	'json',
						data: {
							action: 	'ajax_delete_table',
							nonce: 		newtabdelete.seguridad,
							nombre: 	nombre,
							id: 		id,
							tipo: 		'delete'
						},
						success: function( response ) {

							if ( response.result == 1 ) {
							
								$("[ data-table='" + response.id + "' ]").remove();

								swal("¡Tu tabla " + response.nombre + " ha sido eliminda!", {
									icon: "success",
								  });
								
							}
							else {
								swal("Lo sentimos, no se podido eliminar tu tabla " + data.nombre + " se ha producido un error en la consulta.", {
									icon: "error",
								  });	
							}
						}
					});

				} 
				else {
				  swal("La tabla " + nombre + " no ha sido eliminda.");
				}

			});



			

			
		});

	});

	/**
	 * Redirect to edit page (edit button).
	 */
	$(document).ready( function() {
		$('table').on('click', '[data-new-id-edit]',function(e) {

			var id = $(this).attr('data-new-id-edit');

			location.href = urledit + id;

			console.log(location.href )

		});

	});

	/**
	 * Add users modal open.
	 */
	$(document).ready( function() {
		$( '.addItem' ).on( 'click', function() {

			// Show only the add button
			$('#agregar').css('display', 'block');
			$('#actualizar').css('display', 'none');
			$( '#addUpdate' ).modal('open');
			// Remove activate form
			$('.formularioDataUser label').removeClass('active');

			// Pase emty data in form
			urlImgUser.val('');
			marcoImagen.attr('src', '');
			nombres.val('');
			apellidos.val('');
			email.val('');

		});
	});

	/**
	 * Media manager of wordpress to image user.
	 */
	$(document).ready( function() {
		$('#selectimg').on( 'click', function(e) {

			e.preventDefault();

			if ( marco ) {
				marco.open();
				return;
			}

			marco = wp.media({
				frame: 'select',
				title: 'Seleccionar imagen para usuario',
				button: {
					text: 'Usar esta imagen'
				},
				mulplile: false,
				library: {
					type: 'image'
				}
			});

			marco.on('select', function() {

				var imgUser = marco.state().get('selection').first().toJSON();
				urlImgUser.val( imgUser.url );
				marcoImagen.attr('src', imgUser.url );

			});

			marco.open();
		});
	});

	/**
	 * Validate form fiels (create new user).
	 */
	$(document).ready(function() {

		$('#agregar').on('click', function() {

			var nom			= $('#nombres'),
		 		ape 		= $('#apellidos'),
		 		ema			= $('#email'),

				nombres 	= nom.val(),
		 		apellidos 	= ape.val(),
		 		email 		= ema.val(),
		 		imgUrl		= urlImgUser.val(),

				camposInput = $('.formularioDataUser input');

				if ( validarCamposVacios( camposInput ) ) {
					console.log('inputs vacios');
				}
				else if( validarEmail( email ) == false ) {
					console.log('Correo incorrecto');
					
					ema.removeClass('valid');
					ema.addClass('invalid');

					if( validarEmail( email ) == true ) {
						console.log('Correo correcto');
						ema.removeClass('invalid');
						ema.addClass('valid');

					}

				}
				else {
					camposInput.removeClass('invalid');
					camposInput.addClass('valid');
					preload.css('display', 'flex');

					console.log('todo correcto');

					// Ajax response
					$.ajax({
						url: 		newdata.url,
						type: 		'POST',
						dataType: 	'json',
						data: {
							action: 	'ajax_add_users',
							nonce: 		newdata.seguridad,
							tipo: 		'add',
							idTable:    idTable,
							nombres: 	nombres,
							apellidos: 	apellidos,
							email: 		email,
							imgUrl: 	imgUrl,
						},
						success: function( response ) {
							if ( response.result ) {
								
								preload.css('display', 'none');

								// Success
								swal({
									title: 'Agregado',
									text: 'El usuario ' + nombres + 'ha sido agregado correctamente',
									icon: 'success',
									timer: timer
								});

								// add user
								setTimeout( function(){
									$('#addUpdate').modal('close');
									// Call add table function
									addUserTable( response.insert_id, nombres, apellidos, email, imgUrl );
								}, 3000);

							}
							else {

								preload.css('display', 'none');

								// Error
								swal({
									title: 'Error',
									text: 'Hubo un error al guardar los datos, por favor intentelo mas tarde',
									icon: 'error',
									timer: timer
								});
							}
						}
					});
				}

		});

	});

	/**
	 * Validate form fiels (create new user).
	 */
	function validarCamposVacios( selector ) {

		var inputs	= $( selector ),
			result 	= false;

		$.each( inputs, function( c, v) {

			var input		= $(v),
				inputVal 	= input.val();

			if ( ( inputVal == '' ) && ( input.attr('type') != 'file' ) ) {

				if ( !input.hasClass('invalid') ) 
					input.addClass('invalid');

				result = true;
				
			}

		});

		if ( result ) 
			return true;

		else 
			return false;

	}

	/**
	 * Validate email
	 */
	function validarEmail( email ) {

		var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

		if ( !expr.test( email ) )
			return false;

		else
			return true;

	}

	/**
	 * Add new user in table
	 */
	function addUserTable(id, nombres, apellidos, email, imgUrl ) {

		var output = `
				<tr data-user='${id}'>
					<td>
						<img class='new_media_img' src='${imgUrl}' alt='${nombres} ${apellidos}'>
					</td>
					<td>${nombres}</td>
					<td>${apellidos}</td>
					<td>${email}</td>
					<td>
						<span data-edit='${id}' class='btn btn-floating waves-effect weves-light'>
							<i class='tiny material-icons'>mode_edit</i>
						</span>
					</td>
					<td>
						<span data-remove='${id}' class='btn btn-floating waves-effect weves-light red darken-1'>
							<i class='tiny material-icons'>close</i>
						</span>
					</td>
				</tr>
		`; 

		// Add finaly of table
		$('table tbody').append( output );
	}

	/**
	 * Show the user info in edit button
	 */
	$(document).ready( function()  {

		// Dynamically target each user.
		$('table [data-edit]').on('click', function() {
			// Activate form
			$('.formularioDataUser label').addClass('active');

			// Show only the update button
			$('#agregar').css('display', 'none');
			$('#actualizar').css('display', 'block');

			// Modal open
			$('#addUpdate').modal('open');

			var item 	= $(this),
				id 	 	= item.attr('data-edit');	
			
			var tr 		= item.parent().parent(),
				td1 	= tr.find( $('td:nth-child(1) img') ),
				td2 	= tr.find( $('td:nth-child(2)') ),
				td3 	= tr.find( $('td:nth-child(3)') ),
				td4 	= tr.find( $('td:nth-child(4)') ),
				src 	= td1.attr('src');
		
			// Load data in form
			urlImgUser.val( src );
			marcoImagen.attr( 'src', src );
			nombres.val( td2.text() );
			apellidos.val( td3.text() );
			email.val( td4.text() );

			// Get and put id
			$('#actualizar').attr('data-id', id );
		});

	});

	/**
	 * Update data user.
	 */
	$(document).ready(function() {

		$('#actualizar').on('click', function() {

			// User id
			var item		= $(this),
		 		id 		    = item.attr('data-id');

			// Form data.
			var tr 		= $('table tr[data-user="'+ id +'"]'),
				td1 	= tr.find( $('td:nth-child(1) img') ),
				td2 	= tr.find( $('td:nth-child(2)') ),
				td3 	= tr.find( $('td:nth-child(3)') ),
				td4 	= tr.find( $('td:nth-child(4)') );

			// User data
			var nom		= $('#nombres'),
			ape 		= $('#apellidos'),
			ema			= $('#email'),

		   	nombres 	= nom.val(),
			apellidos 	= ape.val(),
			email 		= ema.val(),
			imgUrl		= urlImgUser.val(),

		   	camposInput = $('.formularioDataUser input');


			if ( validarCamposVacios( camposInput ) ) {

				console.log('inputs vacios');

			}
			else if( validarEmail( email ) == false ) {

				console.log('Correo incorrecto');
				
				ema.removeClass('valid');
				ema.addClass('invalid');
				if( validarEmail( email ) == true ) {
					console.log('Correo correcto');
					ema.removeClass('invalid');
					ema.addClass('valid');
				}

			}
			else {

				camposInput.removeClass('invalid');
				camposInput.addClass('valid');
				preload.css('display', 'flex');
				console.log('todo correcto');

				// Ajax response
				$.ajax({
					url: 		newdata.url,
					type: 		'POST',
					dataType: 	'json',
					data: {
						action: 	'ajax_add_users',
						nonce: 		newdata.seguridad,
						tipo: 		'update',
						idTable: 	idTable,
						idUser:   	id,
						nombres: 	nombres,
						apellidos: 	apellidos,
						email: 		email,
						imgUrl: 	imgUrl,
					},
					success: function( response ) {
						console.log(response);
						if ( response.result ) {
							
							preload.css('display', 'none');
							// Success
							swal({
								title: 'Actualizado',
								text: 'El usuario ' + nombres + 'ha sido actualizado correctamente',
								icon: 'success',
								timer: timer
							});

							// Update user
							setTimeout( function(){

								$('#addUpdate').modal('close');
								// Animation
								tr.addClass('bg-animado');

								td1.attr( 'src', imgUrl );
								td2.text( nombres );
								td3.text( apellidos );
								td4.text( email );

							}, 3000);

							// 
							setTimeout( function() {
								tr.removeClass('bg-animado');
							});
						}
						else {
							preload.css('display', 'none');
							// Error
							swal({
								title: 'Error',
								text: 'Hubo un error al actualizar los datos, por favor intentelo mas tarde',
								icon: 'error',
								timer: timer
							});
						}

					}

				});
			}

		});

	});

	/**
	 * Delete user.
	 */
	$('[data-remove]').on('click', function() {

		var item 	= $(this),
			id	 	= item.attr('data-remove'),
			tr 	 	= $('table tr[data-user="' + id + '"]'),
			nombre 	= tr.find( $('td:nth-child(2)') ).text();

		console.log(id)
		console.log(nombre)

		swal({
			title: 'Esta seguro de eliminar a ' + nombre + '?',
			text: '¡No podras deshacer esto!',
			type: 'warning',
			icon: 'warning',
			buttons: true,
			dangerMode: true,
		})
		.then((willDelete) => {

			if (willDelete) {

				// Delete user ajax
				$.ajax({

					url: newdata.url,
					type: 'POST',
					dataType: 'json',
					data: {
						action: 'ajax_add_users',
						nonce: newdata.seguridad,
						tipo: 'delete',
						idTable: idTable,
						idUser: id,
					},
					success: function( response ) {

						console.log(response);
						
						if ( response.result ) {

							// Alert
							preload.css('display', 'none');
							swal({
								title: 'El usuario ' + nombre + ' ha sido eliminado',
								icon: 'success',
								timer: timer,
							});

							// animation
							tr.css({
								'background': 'red',
								'color': 'white'
							}).fadeOut(1500);

							setTimeout(function() {
								tr.remove();
							}, timer);

						}
						else {

							// Error
							preload.css('display', 'none');
							swal({
								title: 'Error',
								text: 'Hubo un error al eliminar el usuario, por favor intentelo mas tarde',
								icon: 'error',
								timer: timer
							});

						}

					}

				});

			}
			else{

				swal({

					title: 'El usuario no ha sido eliminado',

				});

			}

		})

	});

	
})( jQuery );