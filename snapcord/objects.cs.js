/*global modules SpriteMorph SnapSerializer*/

modules.snapcordObjects = "2018-June-13";

SpriteMorph.prototype.superInit = SpriteMorph.prototype.init;
SpriteMorph.prototype.init = function (globals) {
    this.superInit(globals);
    this.name = 'Division';
};

// --- category control ---

SpriteMorph.prototype.removeCategory = function (name) {
    this.categories.splice(this.categories.indexOf(name), 1);
};

SpriteMorph.prototype.addCategory = function (name, color) {
    this.categories.push(name);
    this.blockColor[name] = color;
};

SpriteMorph.prototype.modifyCategories = function() {
    this.removeCategory('pen');
    this.removeCategory('motion');
    this.removeCategory('sound');
    this.removeCategory('looks');
    this.addCategory('messages', new Color(114, 137, 218));
    this.addCategory('channels', new Color(174, 209, 85));
    this.addCategory('guilds', new Color(24, 145, 83));
    this.addCategory('webhooks', new Color(50, 100, 79));
    this.addCategory('debug', new Color(145, 109, 198));
};
SpriteMorph.prototype.modifyCategories();

SpriteMorph.prototype.changeCategory = function (targetBlock, newCategory) {
    console.log(this)
    this.blocks[targetBlock].category = newCategory;
};

// --- snapcord blocks ---

SpriteMorph.prototype.initSnapcordBlocks = function () {
    var discordBlocks = {
        alertTest: {
            type: 'command',
            category: 'other',
            spec: 'alertTest %s'
        },
        doStopSay: {
            type: 'command',
            category: 'debug',
            spec: 'stop saying'
        },
        doStopThink: {
            type: 'command',
            category: 'debug',
            spec: 'stop thinking'
        },
        doSendWebhook: {
            type: 'command',
            category: 'webhooks',
            spec: 'send message %s to webhook %s',
            defaults: ['Hello!', '']
        }
    };

    var spriteBlocks = SpriteMorph.prototype.blocks,
        watcherLabels = SnapSerializer.prototype.watcherLabels;

    for (var key in discordBlocks) {
        var block = discordBlocks[key];
        spriteBlocks[key] = block;
        if (block.type === 'reporter') {
            watcherLabels[key] = block.spec;
        }
    }
};

SpriteMorph.prototype.superInitBlocks = SpriteMorph.prototype.initBlocks;
SpriteMorph.prototype.initBlocks = function () {
    this.superInitBlocks();
    this.changeCategory('bubble', 'debug');
    this.changeCategory('doSayFor', 'debug');
    this.changeCategory('doThink', 'debug');
    this.changeCategory('doThinkFor', 'debug');
    this.initSnapcordBlocks();
};
SpriteMorph.prototype.initBlocks();

SpriteMorph.prototype.initSnapcordPalette = function () {
    var myself = this;
    // Block creation functions
    function block(selector, isGhosted) {
        if (StageMorph.prototype.hiddenPrimitives[selector]) {
            return null;
        }
        var newBlock = SpriteMorph.prototype.blockForSelector(selector, true);
        newBlock.isTemplate = true;
        if (isGhosted) {
            newBlock.ghost();
        }
        return newBlock;
    }
    function variableBlock(varName, isLocal) {
        var newBlock = SpriteMorph.prototype.variableBlock(varName, isLocal);
        newBlock.isDraggable = false;
        newBlock.isTemplate = true;
        if (contains(inheritedVars, varName)) {
            newBlock.ghost();
        }
        return newBlock;
    }
    function watcherToggle(selector) {
        if (StageMorph.prototype.hiddenPrimitives[selector]) {
            return null;
        }
        var info = SpriteMorph.prototype.blocks[selector];
        return new ToggleMorph(
            'checkbox',
            this,
            function () {
                myself.toggleWatcher(
                    selector,
                    localize(info.spec),
                    myself.blockColor[info.category]
                );
            },
            null,
            function () {
                return myself.showingWatcher(selector);
            },
            null
        );
    }

    // Define palette
    SpriteMorph.prototype.snapcordPalette = {
        sensing: [
            block('doAsk'),
            watcherToggle('getLastAnswer'),
            block('getLastAnswer'),
            '-',
            block('reportKeyPressed'),
            '-',
            block('doResetTimer'),
            watcherToggle('getTimer'),
            block('getTimer'),
            '-',
            block('reportAttributeOf'),
            '-',
            block('reportURL'),
            '-',
            block('reportIsFastTracking'),
            block('doSetFastTracking'),
            '-',
            block('reportDate')
        ],
        debug: [
            block('bubble'),
            block('doSayFor'),
            block('doStopSay'),
            '-',
            block('doThink'),
            block('doThinkFor'),
            block('doStopThink')
        ],
        webhooks: [
            block('doSendWebhook')
        ]
    };
};
SpriteMorph.prototype.initSnapcordPalette();

// snapcord block definitions

SpriteMorph.prototype.doStopSay = function () {
    this.stopTalking();
}

SpriteMorph.prototype.doStopThink = function () {
    this.stopTalking();
}

SpriteMorph.prototype.doSendWebhook = function (message, url) {
    xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({content: message}));
}

// block listing overrides

SpriteMorph.prototype.superBlockTemplates = SpriteMorph.prototype.blockTemplates;
SpriteMorph.prototype.blockTemplates = function (category) {
    var blocks = this.superBlockTemplates(category),
        myself = this;
    // Add blocks
    function addBlocks(paletteBlocks) {
        if (paletteBlocks !== undefined) {
            paletteBlocks.forEach(function (block) {
                blocks.push(block);
            });
            blocks.push('=');
        }
        blocks.push(myself.makeBlockButton(category));
    }
    // Add blocks
    var snapcordPaletteBlocks = this.snapcordPalette[category];
    if (snapcordPaletteBlocks !== undefined) {
        blocks = [];
        addBlocks(snapcordPaletteBlocks)
    }
    // Return blocks list
    return blocks;
};