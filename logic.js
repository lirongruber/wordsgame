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
listener = function () {
    $("#board").on("click", "*", function (e) {
        $(this).toggleClass($(this).data('color'));
        $(this).data('clicked', $(this).hasClass($(this).data('color')));
        console.log($(this).data('id'))
        console.log($(this).data('color'))
    })
    $("#is_manager").on("click", function (e) {
        is_manager = $(this).is(':checked')
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

