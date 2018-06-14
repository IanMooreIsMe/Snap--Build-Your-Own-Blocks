/*global modules IDE_Morph MenuMorph localize*/

modules.snapcordGui = "2018-June-13";

IDE_Morph.prototype.superInit = IDE_Morph.prototype.init;
IDE_Morph.prototype.init = function () {
    this.superInit();
    this.currentCategory = 'control';
} 

MenuMorph.prototype.removeItem = function (name) {
    this.items = this.items.filter(function (item) {
        return item[0] !== name;
    });
};

IDE_Morph.prototype.superProjectMenu = IDE_Morph.prototype.projectMenu;
IDE_Morph.prototype.projectMenu = function () {
    this.superProjectMenu();
    var menu = this.world().activeMenu,
        world = this.world(),
        pos = this.controlBar.projectButton.bottomLeft();
    menu.addLine();
    menu.addItem('Client settings...', 'editClientSettings');
    menu.removeItem(localize('Costumes') + '...');
    menu.removeItem(localize('Sounds') + '...');
    menu.popup(world, pos);
};

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
    var cb = this.controlBar;
    cb.stageSizeButton.hide();
    cb.appModeButton.hide();
    cb.fixLayout = function () {
        var x, padding =5;
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
        this.updateLabel();
    };
};

IDE_Morph.prototype.superCreateSpriteBar = IDE_Morph.prototype.createSpriteBar;
IDE_Morph.prototype.createSpriteBar = function () {
    this.superCreateSpriteBar();
    this.spriteBar.tabBar.hide();
    this.rotationStyleButtons.forEach(function (button) {
        button.hide();
    });
};

IDE_Morph.prototype.superCreateCorral = IDE_Morph.prototype.createCorral;
IDE_Morph.prototype.createCorral = function () {
    this.superCreateCorral();
    var padding = 5;
    this.corral.fixLayout = function () {
        this.stageIcon.setCenter(this.center());
        this.stageIcon.setLeft(this.left() + padding);
        this.frame.setLeft(this.stageIcon.center() + padding);
        this.frame.setExtent(new Point(
            this.right() - this.frame.left(),
            this.height()
        ));
        this.arrangeIcons();
        this.refresh();
    };
    this.corral.fixLayout();
    this.corral.stageIcon.hide();
};

IDE_Morph.prototype.superCreateCorralBar = IDE_Morph.prototype.createCorralBar;
IDE_Morph.prototype.createCorralBar = function () {
    this.superCreateCorralBar();
    var buttons = this.corralBar.children;
    buttons[0].hint = "create new Division";
    buttons[1].hide(); //paint new sprite
    buttons[2].hide(); //new sprite from camera
};

IDE_Morph.prototype.superCreatePalette = IDE_Morph.prototype.createPalette;
IDE_Morph.prototype.createPalette = function (forSearching) {
    var myself = this,
        palette = this.superCreatePalette(forSearching);
    palette.reactToDropOf = function (droppedMorph, hand) {
        if (droppedMorph instanceof DialogBoxMorph) {
            myself.world().add(droppedMorph);
        } else if (droppedMorph instanceof SpriteMorph) {
            if (myself.sprites.length() !== 1) {
                myself.removeSprite(droppedMorph);
            } else {
                myself.showMessage('You cannot delete the last Division!', 2);
                droppedMorph.slideBackTo(hand.grabOrigin);
            }
        } else if (droppedMorph instanceof SpriteIconMorph) {
            if (myself.sprites.length() !== 0) {
                droppedMorph.destroy();
                myself.removeSprite(droppedMorph.object);
            } else {
                myself.showMessage('You cannot delete the last Division!', 2);
                droppedMorph.slideBackTo(hand.grabOrigin);
            }
        } else if (droppedMorph instanceof CostumeIconMorph) {
            myself.currentSprite.wearCostume(null);
            droppedMorph.perish();
        } else if (droppedMorph instanceof BlockMorph) {
            myself.stage.threads.stopAllForBlock(droppedMorph);
            if (hand && hand.grabOrigin.origin instanceof ScriptsMorph) {
                hand.grabOrigin.origin.clearDropInfo();
                hand.grabOrigin.origin.lastDroppedBlock = droppedMorph;
                hand.grabOrigin.origin.recordDrop(hand.grabOrigin);
            }
            droppedMorph.perish();
        } else {
            droppedMorph.perish();
        }
    };
};

SpriteIconMorph.prototype.superUserMenu = SpriteIconMorph.prototype.userMenu;
SpriteIconMorph.prototype.userMenu = function () {
    var menu = this.superUserMenu(),
        ide = this.parent.parent.parent.parent;
    menu.removeItem('clone');
    menu.removeItem('parent...');
    menu.removeItem('edit');
    if (ide.sprites.length() === 1) {
        menu.removeItem('delete');
    }
    return menu;
};

SpriteMorph.prototype.superUserMenu = SpriteMorph.prototype.userMenu;
SpriteMorph.prototype.userMenu = function () {
    var menu = this.superUserMenu(),
        ide = this.parent.parent;
    console.log(this);
    menu.removeItem('clone');
    menu.removeItem('edit');
    if (ide.sprites.length() === 1) {
        menu.removeItem('delete');
    }
    return menu;
};

StageMorph.prototype.superUserMenu = StageMorph.prototype.userMenu;
StageMorph.prototype.userMenu = function () {
    var menu = this.superUserMenu();
    menu.removeItem('edit');
    menu.removeItem('pen trails');
    menu.items.pop();
    return menu;
};

