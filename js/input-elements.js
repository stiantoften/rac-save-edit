const createBooleanInput = (text) => {
    const boolInput = document.createElement('label')

    const span = document.createElement('span')
    span.innerHTML = 'Bomb Glove';

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox';

    boolInput.appendChild(checkbox)
    boolInput.appendChild(span)

    return boolInput;
}