#!/usr/bin/env node
'use strict';

const { version } = require('./package.json');

const logger = function(title) {
    console.log(`\nLog: ${title}`);
    const captions = [], values = [];
    const me = {};
    me.grouping = function(section) {
        console.log(`\n ${section}:`);
        return me;
    }
    me.add = function(caption, value) {
        captions.push(caption);
        values.push(value);
        return me;
    }
    me.log = function() {
        var length = captions.reduce(function(a, b) { return a.length > b.length ? a.length : b.length; });
        length += 3;
        captions.forEach(function(v, i) {
            console.log(`  ${v.padEnd(length, '.')}: ${values[i]}`);
        });
        captions.length = 0;
        values.length = 0;
    }
    return me;
};

const cli = (function() {

    const types = [], names = [], flags = [], flag_map = [];
    const me = {};

    me.add = function(type, name, description, ...flag) {
        var pi = names.length;
        flag.forEach(function(v, i) {
            flags.push(v);
            flag_map.push(pi);
        });
        types.push(type);
        names.push(name);
        me[name] = (type === 'option') ? false : 'missing'; 
        return me;
    }

    me.parse = function(parms) {
        var myarr, parm, ki;
        myarr = parms.slice(2);
        while (myarr.length > 0) {
            parm = myarr.shift();
            ki = flags.indexOf(parm);
            if (ki === -1) {
                me.files.push(parm);
            }
            else {
                me[names[flag_map[ki]]] = 
                    (types[flag_map[ki]] === 'option')
                    ? true 
                    : me[names[flag_map[ki]]] = myarr.shift();
            }
        }
        return me;
    }
    me.add('option', 'version', 'cli tool version', '-v', '--version');
    me.add('option', 'help', 'cli tool help', '-h', '--help');
    me.files = [];
    return me;
}());


var mycli = cli;

mycli
    .add('param', 'delim','field delimiter in file', '-d','--delim','-D')
    .add('param', 'unique','column index for list of unique values', '-u','--unique')
    .parse(process.argv);

if (mycli.version) {
    console.log(version);
    process.exit();
}
if (mycli.help) {
    console.log(JSON.stringify(mycli));
    process.exit();
}

var mylog = logger('Processing flatfile');

// set defaults
if (mycli.delim === 'missing') mycli.delim = '^';

mylog
    .grouping('Job Parameters')
    .add('Files to process', JSON.stringify(mycli.files))
    .add('Delimiter', mycli.delim)
    .add('Unique values at', mycli.unique)
    .log();

mylog
    .grouping('New Section')
    .add('Now what?', 'nothing')
    .add('Sure?', 'yes')
    .log();
