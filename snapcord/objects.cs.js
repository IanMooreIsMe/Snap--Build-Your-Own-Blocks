/*global modules SpriteMorph*/

modules.snapcordObjects = "2018-June-13";

SpriteMorph.prototype.superInit = SpriteMorph.prototype.init;
SpriteMorph.prototype.init = function (globals) {
    this.superInit(globals);
    this.name = 'Division';
};

// --- snapcord blocks ---

SpriteMorph.prototype.initDiscordBlocks = function () {
    var discordBlocks = {
        alertTest: {
            type: 'command',
            category: 'discord',
            spec: 'alertTest %s'
        }
    };

    console.log(this);

    var spriteBlocks = SpriteMorph.prototype.blocks,
        watcherLabels = SnapSerializer.prototype.watcherLabels;

    for (var key in discordBlocks) {
        spriteBlocks[key] = discordBlocks[key];
        if (discordBlocks[key].type === 'reporter') {
            watcherLabels[key] = discordBlocks[key].spec;
        }
    }
};

var categories = SpriteMorph.prototype.categories;
categories.splice(categories.indexOf('pen'), 1);
categories.splice(categories.indexOf('motion'), 1);
categories.splice(categories.indexOf('sound'), 1);
SpriteMorph.prototype.categories.push('discord');
SpriteMorph.prototype.blockColor.discord = new Color(114, 137, 218);

SpriteMorph.prototype.initDiscordBlocks();

SpriteMorph.prototype.superInitBlocks = SpriteMorph.prototype.initBlocks;
SpriteMorph.prototype.initBlocks = function () {
    this.superInitBlocks();
    this.initDiscordBlocks();
};

SpriteMorph.prototype.superBlockTemplates = SpriteMorph.prototype.blockTemplates;
SpriteMorph.prototype.blockTemplates = function (category) {
    var blocks = this.superBlockTemplates(category);
    function block(selector, isGhosted) {
        if (StageMorph.prototype.hiddenPrimitives[selector]) {
            return null;
        }
        var newBlock = SpriteMorph.prototype.blockForSelector(selector, true);
        newBlock.isTemplate = true;
        if (isGhosted) {newBlock.ghost(); }
        return newBlock;
    }
    if (category === 'discord') {
        blocks.push(block('alertTest'));
    }
    return blocks;
}

SpriteMorph.prototype.alertTest = function (text) {
    alert(text);
};