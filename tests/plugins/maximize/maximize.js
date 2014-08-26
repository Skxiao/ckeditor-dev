/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: maximize,sourcearea */

bender.editor = true;

bender.test( {
	// #4355
	'test command exec not require editor focus': function() {
		if ( this.editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
			assert.ignore();

		var bot = this.editorBot, editor = this.editor;

		var focused = false;
		editor.on( 'focus', function() {
			focused = true;
		} );

		// Maximize command will take some time.
		bot.execCommand( 'maximize' );
		wait(
			function() {
				bot.execCommand( 'maximize' );
				assert.isFalse( focused );
			}, 0
		);
	},

	'test maximize in source mode': function() {
		if ( this.editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
			assert.ignore();

		var bot = this.editorBot;
		// Switch to source mode.
		this.editor.setMode( 'source', function() {
			// Maximize command will take some time.
			bot.execCommand( 'maximize' );
			setTimeout( function() {
				resume( function() {
					bot.execCommand( 'maximize' );

					assert.isTrue( true );
				} );
			}, 0 );
		} );

		wait();
	},

	'test maximize fire resize event with proper properties': function() {
		var calls = 0,
			lastResizeData;

		this.editor.on( 'resize', function( e ) {
			calls++;
			lastResizeData = e.data;
		} );

		this.editor.resize( 200, 400 );

		this.editor.execCommand( 'maximize' );
		assert.areEqual( 2, calls, 'Event should be fired twice till now.' );
		assert.areEqual( window.innerHeight, lastResizeData.outerHeight, 'Height should be same as window height.' );
		assert.areEqual( window.innerWidth, lastResizeData.outerWidth, 'Width should be same as window height.' );

		this.editor.execCommand( 'maximize' );
		assert.areEqual( 3, calls, 'Event should be fired thrice till now.' );
		assert.areEqual( 200, lastResizeData.outerWidth, 'Width should be restored.' );
		assert.areEqual( 400, lastResizeData.outerHeight, 'Height should be restored.' );
	},

	'test maximize command work when config title is set to empty string': function() {
		bender.editorBot.create( {
			name: 'editor2',
			config: {
				title: ''
			}
		}, function( bot ) {
			var inner = bot.editor.container.getFirst( function( node ) {
				return node.hasClass( 'cke_inner' );
			} );

			bot.editor.execCommand( 'maximize' );
			assert.isTrue( inner.hasClass( 'cke_maximized' ) );

			bot.editor.execCommand( 'maximize' );
			assert.isFalse( inner.hasClass( 'cke_maximized' ) );
		} );
	}
} );