//=============================================================================
// RecollectionTitle.js
//=============================================================================
/*:
 * @plugindesc 타이틀 화면에 "회상 방" 메뉴를 추가해 회상 방으로 바로 이동합니다.
 *
 * @param Command Name
 * @default 회상 방
 *
 * @param Map ID
 * @default 4
 *
 * @param X
 * @default 5
 *
 * @param Y
 * @default 6
 *
 * @param Unlock Switches
 * @desc 회상 방에 들어갈 때 켜 둘 스위치 (모든 장면 해금)
 * @default 30,33,40
 */
(function() {
    var params = PluginManager.parameters('RecollectionTitle');
    var commandName = String(params['Command Name'] || '회상 방');
    var mapId = Number(params['Map ID'] || 4);
    var x = Number(params['X'] || 5);
    var y = Number(params['Y'] || 6);
    var switches = String(params['Unlock Switches'] || '').split(',').map(Number).filter(function(n) { return n > 0; });

    var _makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _makeCommandList.call(this);
        var index = this._list.findIndex(function(c) { return c.symbol === 'options'; });
        var cmd = { name: commandName, symbol: 'recollection', enabled: true, ext: null };
        if (index >= 0) {
            this._list.splice(index, 0, cmd);
        } else {
            this._list.push(cmd);
        }
    };

    var _createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _createCommandWindow.call(this);
        this._commandWindow.setHandler('recollection', this.commandRecollection.bind(this));
    };

    Scene_Title.prototype.commandRecollection = function() {
        DataManager.setupNewGame();
        switches.forEach(function(id) { $gameSwitches.setValue(id, true); });
        $gamePlayer.reserveTransfer(mapId, x, y, 8, 0);
        this._commandWindow.close();
        this.fadeOutAll();
        SceneManager.goto(Scene_Map);
    };
})();
