/*global modules SpriteMorph*/

modules.snapcordObjects = "2018-June-13";

SpriteMorph.prototype.initDiscordBlocks = function () {
    var discordBlocks = {
        test: {
            type: "command",
            category: "discord",
            spec: "test"
        }
    };

    var spriteBlocks = SpriteMorph.prototype.blocks,
        watcherLabels = SnapSerializer.prototype.watcherLabels;

    for (var key in discordBlocks) {
        spriteBlocks[key] = discordBlocks[key];
        if (discordBlocks[key].type === 'reporter') {
            watcherLabels[key] = discordBlocks[key].spec;
        }
    }
};
  
SpriteMorph.prototype.categories.push('discord');
var categories = SpriteMorph.prototype.categories;
categories.splice(categories.indexOf('pen'), 1);
categories.splice(categories.indexOf('motion'), 1);
categories.splice(categories.indexOf('sound'), 1);
SpriteMorph.prototype.blockColor.discord = new Color(114, 137, 218);
SpriteMorph.prototype.initDiscordBlocks();

SpriteMorph.prototype.baseInitBlocks = SpriteMorph.prototype.initBlocks;
SpriteMorph.prototype.initBlocks = function () {
    this.baseInitBlocks();
    //var baseBlocks = SpriteMorph.prototype.blocks;
    //baseBlocks.splice(baseBlocks.indexOf('receiveGo', 1));
    SpriteMorph.prototype.initDiscordBlocks();
};

SpriteMorph.prototype.baseInit = SpriteMorph.prototype.init;
SpriteMorph.prototype.init = function (globals) {
    this.baseInit(globals);
    this.name = "Division";
};

SpriteMorph.prototype.test = function () {
    alert("hi");
};