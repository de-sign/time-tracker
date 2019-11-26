const
    fs = require('fs'),
    path = require('path'),
    excel4node = require('excel4node');

// TODO : Utiliser un Module EXCEL pour faire lecture / ecriture
class ES_Excel4Node {
    constructor(oOptions){
        this._options = oOptions;
        this._sheets = {};
        this._style = {};
        this._workbook = null;
        this._initialize();
    }

    _initialize() {
        this._workbook = new excel4node.Workbook();
        for( let i in this._options.style ){
            this._style[i] = this._workbook.createStyle( this._options.style[i] );
        }
        for( let i in this._options.sheets ){
            this.addSheet(i, this._options.sheets[i] || {});
        }
    }

    addSheet(sSheet, oOptions = {}){
        oOptions = Array.isArray(oOptions) ? { aColumn: oOptions } : oOptions;
        this[sSheet] = this._sheets[sSheet] = Object.assign(
            this._workbook.addWorksheet(sSheet, oOptions.oOptions), {
                _row: 1,
                appendRow: (...aRow) => this._appendRowToSheet(sSheet, aRow)
            }
        );
        return this._initializeSheet(sSheet, oOptions.aColumn);
    }

    write(sPath) {
        const sDir = sPath ? path.dirname(sPath) : path.join(ES.remote.app.getPath('userData'), this._options.cwd),
            sName = sPath ? path.basename(sPath) : this._options.name;

        !fs.existsSync(sDir) && fs.mkdirSync(sDir);
        this._workbook.write(
            path.join(sDir, sName),
            function(err, stats) {
                err && console.error(err);
            }
        );
    }

    _appendRowToSheet(sSheet, aRow) {
        const oOptions = this._options.sheets[sSheet];
        aRow.forEach(aColumn => {
            aColumn.forEach( (oColumn, nIndex) => {
                
                oColumn = oColumn && oColumn._value !== undefined ?
                    oColumn : { _value: oColumn };

                const oCell = this[sSheet].cell( this[sSheet]._row, nIndex + 1 ),
                    sType = oColumn._type || oOptions[nIndex]._type || 'string',
                    sStyle = oColumn._style || oOptions[nIndex]._style,
                    oStyle = typeof sStyle === 'string' ?
                        this._style[sStyle] : sStyle;

                    if( oColumn._value != null ){
                        oCell[sType](oColumn._value);
                        oStyle && oCell.style(oStyle);
                    }
            } );
            this[sSheet]._row++;
        } );
    }

    _initializeSheet(sSheet, oOptions) {

        const aFilter = [];
        let bHeader = false, i = 0;
        for(i in oOptions){
            if( oOptions[i]._title ){
                bHeader = true;
                break;
            }
        }

        oOptions.forEach( (oColumn, nIndex) => {

            const oRow = this[sSheet].row(this[sSheet]._row),
                oCol = this[sSheet].column(nIndex + 1),
                oCell = this[sSheet].cell(this[sSheet]._row, nIndex + 1);

            if( bHeader ){
                oCell.string(oColumn._title);
                this._style._header && oCell.style(this._style._header);
            }
            
            oColumn._width && oCol.setWidth(oColumn._width);
            oColumn._freeze && oCol._freeze(oColumn._freeze);
            oColumn._hide && oCol.hide();
            oColumn._filter && oRow.filter( oColumn._filter === true ? undefined : oColumn._filter );
            oColumn._group && oCol._group.apply(oCol, oColumn._group);

        } );
        
        bHeader && this[sSheet]._row++;
        return this[sSheet];
    }
}

module.exports = (ES) => {

    return {
        // Properties
        oInstances: {},
        
        // Methods
        initialize(oOptions = {}) {
            for( let sName in oOptions ){
                this.create(sName, oOptions[sName]);
            }
            return Promise.resolve();
        },

        create(sName, oOptions) {
            if( !this[sName] ){
                this[sName] = this.oInstances[sName] = {
                    oOptions: Object.assign( oOptions, {
                        cwd: path.join('Electron Starter', 'Export', oOptions.cwd || '')
                    } ),
                    create() {
                        return new ES_Excel4Node(this.oOptions);
                    }
                };
            }
        }
    };
};