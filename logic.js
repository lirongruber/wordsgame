let number_of_words_per_game = 25, board_width = 5, board_height = 5;

first_team = 9;
second_team = 8;
black = 1;
white = number_of_words_per_game - first_team - second_team - black;


state = {"cards": [], "teams_order": [], "player_type": "manager"}
card = {"id": "", "text": "", "color": ""}

function generate_cards() {
    _.each(_.range(first_team), function () {
        cards_colors.push(teams_order[0])
    })
    _.each(_.range(second_team), function () {
        cards_colors.push(teams_order[1])
    })
    _.each(_.range(white), function () {
        cards_colors.push("white")
    })
    _.each(_.range(black), function () {
        cards_colors.push("black")
    })

    return cards_colors;
}

generate = function () {
    w = _.sample(words, number_of_words_per_game)
    cards_colors = [];

    new_state = JSON.parse(JSON.stringify(state));

    teams_order = _.shuffle(["blue", "red"])
    new_state["teams_order"] = teams_order


    cards_colors = generate_cards();
    cards_colors = _.shuffle(cards_colors)
    new_state["cards"] = []
    _.each(w, function (elem, i, lst) {
        new_card = JSON.parse(JSON.stringify(card));
        new_card["id"] = i;
        new_card["text"] = w[i];
        new_card["color"] = cards_colors[i];
        new_state["cards"].push(new_card);

    })

    console.log(new_state)

    return new_state;
}

render = function (state) {
    card_template = _.template("<div class='card' data-id=\"<%=id %>\" data-color=\"<%= color %>\"><%= text %></div>");
    $("#board").html("")
    _.each(state['cards'], function (card, i, lst) {
        $("#board").append(card_template(card))
    })
    $(".control").addClass(state.teams_order[0]);
}

winner_interval = 0;
render_winner = function(winner, stop){
    $('.winning').removeClass('is-hidden')
    new_state['running'] = false;
    winner_interval= setInterval(function(){ 
        $('.winning').removeClass('is-hidden')        
        $('.winning').solitaireVictory();
    }, 1000);
    
}

stop_render_winner = function(){
    $('.winning').addClass('is-hidden')
    
    clearInterval(winner_interval)
    $('').solitaireVictory({clear: true});
    
    winner_interval = "stopped"
}


listener = function () {
    $(document).on("click",".winning", function() 
    {
        stop_render_winner()
        
        
        
        
    });
    $("#new_game").on("click",function(e){
        if (!confirm("Do you want to create a new game?")){
            return;
        }

        let searchParams = new URLSearchParams(window.location.search)
        searchParams.set("gameId", ""); // setting your param
        history.pushState(null, null, "?"+searchParams.toString());        
        location.reload(true);
        
    })
    $("#board").on("click", "*", function (e) {

        
        $(this).toggleClass($(this).data('color'));
        $(this).data('clicked', $(this).hasClass($(this).data('color')));
        console.log($(this).data('id'))
        console.log($(this).data('color'))
        visible_red_cards = $("#board .card.red")
        visible_blue_cards = $("#board .card.blue")

        if   (winner_interval == "stopped"){
            return;
        }
        if ($("#is_manager").is(':checked')) {
            return;
        }
        if (first_team == $("#board .card."  + new_state["teams_order"][0]).length){
            //first_team winns
            console.log(teams_order[0] + " wins")
            $('.winning').addClass(teams_order[0])
            render_winner()
        }

        if (second_team == $("#board .card."  + new_state["teams_order"][1]).length){
            console.log(teams_order[1] + " wins")
            $('.winning').addClass(teams_order[1])
            render_winner()
            
        }
   
       

    })
    $("#is_manager").on("click", function (e) {
        is_manager = $(this).is(':checked')
        if (is_manager){
            if (!confirm("Do you want to reveal the board?")){
                $(this).prop('checked', false);
                return;
            }
        }
        $("#board").toggleClass("is-manager");
        $('.card').each(function (card, i, lst) {
            if (is_manager) {
                $(this).addClass($(this).data('color'));
            } else {
                if (_.isUndefined($(this).data('clicked'))) {
                    $(this).removeClass($(this).data('color'));
                }
            }
        })
    })
}

state = generate();
render(state)
listener()

