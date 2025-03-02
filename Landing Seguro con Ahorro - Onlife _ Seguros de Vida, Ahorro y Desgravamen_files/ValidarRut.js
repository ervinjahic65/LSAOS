    RutHelper = {

    formatearFull: function ( rut, skipDots )
    {
        var noFormat = RutHelper.quitarFormato( rut );
        var run = [noFormat.slice( 0, noFormat.length - 1 ), '-', noFormat.slice( noFormat.length - 1 )].join( '' );
        var formattedRun = run.split( '-' );
        
        return RutHelper.formatear( formattedRun[0] + formattedRun[1], formattedRun[1], skipDots );
    },

    formatear: function ( rut, digitoVerificador, skipDots )
    {
        var sRut = new String( rut );
        var sRutFormateado = '';
        sRut = RutHelper.quitarFormato( sRut );
        if ( digitoVerificador )
        {
            var sDV = sRut.charAt( sRut.length - 1 );
            sRut = sRut.substring( 0, sRut.length - 1 );
        }
        if ( !skipDots )
        {
            while ( sRut.length > 3 )
            {
                sRutFormateado = "." + sRut.substr( sRut.length - 3 ) + sRutFormateado;
                sRut = sRut.substring( 0, sRut.length - 3 );
            }
        }
        sRutFormateado = sRut + sRutFormateado;
        if ( sRutFormateado != "" && digitoVerificador )
        {
            sRutFormateado += "-" + sDV;
        }
        else if ( digitoVerificador )
        {
            sRutFormateado += sDV;
        }

        
        return sRutFormateado;
    },

    quitarFormato: function ( rut )
    {
        
        var strRut = new String( rut );
        while ( strRut.indexOf( "." ) != -1 )
        {
            strRut = strRut.replace( ".", "" );
        }
        while ( strRut.indexOf( "-" ) != -1 )
        {
            strRut = strRut.replace( "-", "" );
        }

        return strRut;
    },

    digitoValido: function ( dv )
    {
        
        if ( dv != '0' && dv != '1' && dv != '2' && dv != '3' && dv != '4'
            && dv != '5' && dv != '6' && dv != '7' && dv != '8' && dv != '9'
            && dv != 'k' && dv != 'K' )
        {
            
            return false;
        }
        
        return true;
        
    },

    digitoCorrecto: function ( crut )
    {
        
        largo = crut.length;
        if ( largo < 2 )
        {
            
            return false;
        }
        if ( largo > 2 )
        {
            
            rut = crut.substring( 0, largo - 1 );
        }
        else
        {
            rut = crut.charAt( 0 );
        }
        dv = crut.charAt( largo - 1 );
        RutHelper.digitoValido( dv );

        if ( rut == null || dv == null )
        {
            return 0;
        }

        dvr = RutHelper.getDigito( rut );

        if ( dvr != dv.toLowerCase() )
        {
            
            return false;
        }
        
        return true;
    },

    getDigito: function ( rut )
    {
       
        var dvr = '0';
        suma = 0;
        mul = 2;
        for ( i = rut.length - 1; i >= 0; i-- )
        {
            suma = suma + rut.charAt( i ) * mul;
            if ( mul == 7 )
            {
                mul = 2;
            }
            else
            {
                mul++;
            }
        }
        res = suma % 11;
        if ( res == 1 )
        {
            return 'k';
        }
        else if ( res == 0 )
        {
            return '0';
        }
        else
        {
            return 11 - res;
        }
    },

    validar: function ( texto )
    {
        
        texto = RutHelper.quitarFormato( texto );
        largo = texto.length;

        // rut muy corto
        if ( largo < 2 )
        {
            
            return false;
        }

        // verifica que los numeros correspondan a los de rut
        for ( i = 0; i < largo; i++ )
        {
            // numero o letra que no corresponda a los del rut
            if ( !RutHelper.digitoValido( texto.charAt( i ) ) )
            {
               
                return false;
            }
        }

        var invertido = "";
        for ( i = ( largo - 1 ), j = 0; i >= 0; i-- , j++ )
        {
            invertido = invertido + texto.charAt( i );
        }
        var dtexto = "";
        dtexto = dtexto + invertido.charAt( 0 );
        dtexto = dtexto + '-';
        cnt = 0;

        for ( i = 1, j = 2; i < largo; i++ , j++ )
        {
            if ( cnt == 3 )
            {
                dtexto = dtexto + '.';
                j++;
                dtexto = dtexto + invertido.charAt( i );
                cnt = 1;
            }
            else
            {
                dtexto = dtexto + invertido.charAt( i );
                cnt++;
            }
        }

        invertido = "";
        for ( i = ( dtexto.length - 1 ), j = 0; i >= 0; i-- , j++ )
        {
            invertido = invertido + dtexto.charAt( i );
        }

        if ( RutHelper.digitoCorrecto( texto ) )
        {
            return true;
            
        }
        return false;
    }


};
