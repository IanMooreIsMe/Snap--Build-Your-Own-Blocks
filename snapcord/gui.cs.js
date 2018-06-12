IDE_Morph.prototype.superProjectMenu = IDE_Morph.prototype.projectMenu;
IDE_Morph.prototype.projectMenu = function () {
    this.superProjectMenu();
    var menu = this.world().activeMenu,
        world = this.world(),
        pos = this.controlBar.projectButton.bottomLeft();
    menu.addLine();
    menu.addItem('Client settings...', 'editClientSettings');
    menu.items.splice(13, 2); //costumes and sounds
    menu.popup(world, pos);
    console.log(menu);
}

IDE_Morph.prototype.editClientSettings = function () {

    var dialog = new DialogBoxMorph().withKey('clientSettings'),
        frame = new ScrollFrameMorph(),
        text = new TextMorph(this.clientSettings || ''),
        ok = dialog.ok,
        myself = this,
        size = 250,
        world = this.world();

    frame.padding = 6;
    frame.setWidth(size);
    frame.acceptsDrops = false;
    frame.contents.acceptsDrops = false;

    text.setWidth(size - frame.padding * 2);
    text.setPosition(frame.topLeft().add(frame.padding));
    text.enableSelecting();
    text.isEditable = true;

    frame.setHeight(size);
    frame.fixLayout = nop;
    frame.edge = InputFieldMorph.prototype.edge;
    frame.fontSize = InputFieldMorph.prototype.fontSize;
    frame.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    frame.contrast = InputFieldMorph.prototype.contrast;
    frame.drawNew = InputFieldMorph.prototype.drawNew;
    frame.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    frame.addContents(text);
    text.drawNew();

    dialog.ok = function () {
        myself.clientSettings = text.text;
        ok.call(this);
    };

    dialog.justDropped = function () {
        text.edit();
    };

    dialog.labelString = 'Client Settings';
    dialog.createLabel();
    dialog.addBody(frame);
    frame.drawNew();
    dialog.addButton('ok', 'OK');
    dialog.addButton('cancel', 'Cancel');
    dialog.fixLayout();
    dialog.drawNew();
    dialog.popUp(world);
    dialog.setCenter(world.center());
    text.edit();
};

IDE_Morph.prototype.superCreateControlBar = IDE_Morph.prototype.createControlBar;
IDE_Morph.prototype.createControlBar = function () {
    this.superCreateControlBar();
    this.controlBar.stageSizeButton.hide();
    this.controlBar.appModeButton.hide();
    var padding = 5,
        cb = this.controlBar;
    cb.fixLayout = function () {
        x = this.right() - padding;
        [cb.stopButton, cb.pauseButton, cb.startButton, cb.steppingButton, cb.steppingSlider].forEach(
            function (button) {
                button.setCenter(cb.center());
                button.setRight(x);
                x -= button.width();
                x -= padding;
            }
        );

        cb.settingsButton.setCenter(cb.center());
        cb.settingsButton.setLeft(this.left());

        cb.cloudButton.setCenter(cb.center());
        cb.cloudButton.setRight(cb.settingsButton.left() - padding);

        cb.projectButton.setCenter(cb.center());
        cb.projectButton.setRight(cb.cloudButton.left() - padding);

        this.refreshSlider();
    };
    cb.fixLayout();
}

IDE_Morph.prototype.superCreateSpriteBar = IDE_Morph.prototype.createSpriteBar;
IDE_Morph.prototype.createSpriteBar = function () {
    this.superCreateSpriteBar();
    this.spriteBar.tabBar.hide();
    this.rotationStyleButtons.forEach(function (button) {
        button.hide();
    });
}