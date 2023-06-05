window.addEventListener('DOMContentLoaded', () => {
  let dataBase = {};
  let savePerValues = document.querySelector('.btn--persent'),
    allPercentInput = document.querySelectorAll('.persent__input'),
    allCheckRadio = document.querySelectorAll('.check__radio'),
    calcBtn = document.querySelector('.calc-btn'),
    errorMessage = document.querySelector('.error-message'),
    scoreBtn = document.querySelector('.score__btn'),
    scoreInput = document.querySelector('.score__input'),
    actualScore = document.querySelector('.actual-score'),
    basicMixerSize = document.querySelector('.select-mixer'),
    basicMixerSizeValue = +document.querySelector('.select-mixer').value,
    countComponent = 0;

  basicMixerSize.addEventListener('change', (e) => {
    basicMixerSizeValue = Number(e.target.value);
  });

  savePerValues.addEventListener('click', saveValues);

  function saveValues() {
    document.querySelectorAll('.result__title').forEach(e => {
      e.classList.remove('show');
    });
    clearScore();

    let checkSum = 0;

    for (let item of allPercentInput) {

      checkSum += +item.value;
      let currentItemId = item.id,
        currentItemData = item.getAttribute('data-check'),
        currentIcon = document.getElementById(currentItemData);

      if (checkSum > 100) {
        item.value = '';
        currentIcon.style.opacity = '0';
        dataBase[currentItemId] = '0';
        document.getElementById(`radio-${currentItemId}`).disabled = true;
        alert('Suma wszystkich składników powinna być w zakresie od 0 do 100%');
        break;
      }

      if (item.value <= 0) {
        item.value = '';
        currentIcon.style.opacity = '0';
        dataBase[currentItemId] = '0';
        document.getElementById(`radio-${currentItemId}`).disabled = true;

      } else {

        if (item.value) {
          currentIcon.style.opacity = '1';
          dataBase[currentItemId] = item.value;
          document.getElementById(`radio-${currentItemId}`).disabled = false;
        } else {
          currentIcon.style.opacity = '0';
          dataBase[currentItemId] = '0';
          document.getElementById(`radio-${currentItemId}`).disabled = true;
        }
      }
    }
    showAmount(dataBase);
  }


  function showAmount(percent) {

    for (let key in percent) {

      let min = Math.ceil((270 * percent[key]) / 100);
      let max = Math.ceil((450 * percent[key]) / 100);

      if (key.length <= 5) {
        percent[`min${key}`] = min;
        percent[`max${key}`] = max;

        document.getElementById(`min${key}`).innerHTML = min;
        document.getElementById(`max${key}`).innerHTML = max;
      }
    }
  }

  scoreBtn.addEventListener('click', () => {
    let min;

    for (let item of allCheckRadio) {
      if (item.checked === true) {
        let currentCheck = item.getAttribute('data-value');
        min = dataBase[`min${currentCheck}`];
      }
    }

    if (scoreInput.value > 50000) {
      clearScore();
    }

    else if (scoreInput.value < min) {
      clearScore();
      errorMessage.style.opacity = '1';
    }


    else {
      countComponent = scoreInput.value;
      actualScore.innerHTML = `${countComponent} kg`;
      errorMessage.style.opacity = '0';
    }

    if (countComponent !== 0) {
      calcBtn.disabled = false;
    } else {
      calcBtn.disabled = true;
    }
  });

  calcBtn.addEventListener('click', calcAmount);

  function calcAmount() {

    for (let item of allCheckRadio) {

      if (item.checked == true) {
        let currentCheck = item.getAttribute('data-value'),
          basicValue = (basicMixerSizeValue * dataBase[currentCheck] / 100),
          min = dataBase[`min${currentCheck}`],
          max = dataBase[`max${currentCheck}`],

          basicPortions = Math.floor(countComponent / basicValue),
          rest = countComponent - (basicPortions * basicValue);

        calcAll(min, max, basicValue, basicPortions, rest);
      }
    }
  }

  function calcAll(min, max, basicValue, basicPortions, rest) {

    let i = 1,
      select = document.querySelector('.check-select'),
      selectValue = select.value;

    if (countComponent >= min && countComponent < max) {
      let newPortions = Math.floor((countComponent * basicMixerSizeValue) / basicValue),
        cans = Math.ceil(newPortions / selectValue);
      showResult(i, 0, newPortions, i, 0, cans);
    }


    else if (countComponent >= max && (countComponent / 2) < min) {
      rest = Math.floor(countComponent - max);
      let newPortions = 450,
        cans = Math.ceil(newPortions / selectValue);

      showResult(1, 0, newPortions, 1, rest, cans);
    }

    else if (countComponent >= max && (countComponent / min) >= 2 && basicPortions < 2) {
      let newRest = countComponent / 2,
        newPortions = Math.ceil((newRest * basicMixerSizeValue) / basicValue),
        cans = Math.ceil(newPortions / selectValue) * 2;

      showResult(2, 0, newPortions, 2, 0, cans);
    }

    else {

      if (rest < min) {

        do {
          if (rest >= min && rest / i >= min) {
            break;
          } else {
            basicPortions -= 1;
            rest += basicValue;
            i++;
          }

        } while (i < 5);

      }

      let newRest = rest / i,
        newPortions = Math.floor((newRest * basicMixerSizeValue) / basicValue),
        basicResult = basicPortions + i;

      let basicCansCaunt = Math.ceil((basicMixerSizeValue / selectValue) * basicPortions),
        newCansCaunt = Math.ceil((newPortions / selectValue) * i),
        allCans = basicCansCaunt + newCansCaunt;

      showResult(basicResult, basicPortions, newPortions, i, 0, allCans);
    }
  }

  function showResult(basicResult, basicPortions, portionsValue, portionsCount, restCount, cans) {

    document.querySelector('.basic-portions__label').innerHTML = `${basicMixerSizeValue} kg`;
    document.querySelector('.basic-result').innerHTML = `${basicResult} szt.`;
    document.querySelector('.basic-portions').innerHTML = `${basicPortions} szt.`;
    document.querySelector('.portions-value').innerHTML = `${portionsValue} kg`;
    document.querySelector('.portions-count').innerHTML = `${portionsCount} szt.`;
    document.querySelector('.rest__count').innerHTML = `${restCount} kg`;
    document.querySelector('.cans__value').innerHTML = `${cans} szt.`;

    document.querySelectorAll('.result__title').forEach(e => {
      e.classList.add('show');
    });

    document.querySelector('.result__items').classList.add('result__items--show');

    if (basicPortions === 0) {
      document.querySelector('.optionally').classList.remove('show');
    }
    if (restCount === 0) {
      document.querySelector('.rest').classList.remove('show');
    }
  }


  allCheckRadio.forEach(item => {
    item.addEventListener('change', (event) => {
      document.querySelector('.score').classList.add('show');
      let currentRadio = event.currentTarget.id;
      clearRadio(currentRadio);
      clearScore();
    });
  });

  function clearRadio(item) {
    allCheckRadio.forEach(e => {
      e.checked = false;
    });
    document.getElementById(item).checked = true;
  }

  function clearScore() {
    actualScore.innerHTML = '0';
    document.querySelectorAll('.result__title').forEach(e => {
      e.classList.remove('show');
    });
    document.querySelector('.result__items').classList.remove('result__items--show');
    calcBtn.disabled = true;
    scoreInput.value = '';
    countComponent = 0;

  }

  document.querySelector('.btn--clear').addEventListener('click', () => {
    window.location.reload();
  });
});