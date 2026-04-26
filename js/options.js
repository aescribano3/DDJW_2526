import {$} from "../library/jquery-4.0.0.slim.module.min.js";

var options = function(){
    const default_options = {
        pairs: 2,
        difficulty: 'normal',
		group: 2
    } 

    var pairs = $('#pairs');
    var difficulty = $('#dif');
	var group = $('#group');
    
    var savedOptions = localStorage.options && JSON.parse(localStorage.options);
    var options = Object.create(default_options);

    if (savedOptions && savedOptions.pairs)
        options.pairs = savedOptions.pairs;
    if (savedOptions && savedOptions.difficulty)
        options.difficulty = savedOptions.difficulty;
	if (savedOptions && savedOptions.group)
		options.group = savedOptions.group;

    pairs.val(options.pairs);
    difficulty.val(options.difficulty);
	group.val(options.group);

    pairs.on('change', function (){
        options.pairs = pairs.val();
    });

    difficulty.on('change', function (){
        options.difficulty = difficulty.val();
    });

	group.on('change', function (){
		options.group = group.val();
	});

    return {
        applyChanges: function(){
            localStorage.options = JSON.stringify(options);
        },
        defaultValues: function(){
            options.pairs = default_options.pairs;
            options.difficulty = default_options.difficulty;
			options.group = default_options.group;
            pairs.val(options.pairs);
            difficulty.val(options.difficulty);
			group.val(options.group);
        }
    }
}();

$('#default').on('click', function(){
    options.defaultValues();
})

$('#apply').on('click', function(){
    options.applyChanges();
    window.location.assign("../html/game.html");
});
