class UI {

  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }

  editExpense = (elt) => {
    let id = parseInt(elt.dataset.id);
    let ggParent = elt.parentElement.parentElement.parentElement;

    this.expenseList.removeChild(ggParent);

    let expense = this.itemList.filter((item) => {
      return item.id === id;
    })[0];

    this.expenseInput.value = expense.title;
    this.amountInput.value = expense.amount;

    let tempList = this.itemList.filter((item) => {
      return item.id !== id;
    });

    this.itemList = tempList;
    this.showBalance();
  }

  deleteExpense = (elt) => {
      let id = parseInt(elt.dataset.id);
      let ggParent = elt.parentElement.parentElement.parentElement;

      this.expenseList.removeChild(ggParent);

      let tempList = this.itemList.filter((item) => {
          return id !== item.id;
      });

      this.itemList = tempList;
      this.showBalance();
  };

  totalExpense = () => {
      let total = 0;
      if (this.itemList.length > 0) {
          total = this.itemList.reduce((acc, curr) => {
              acc += curr.amount;
              return acc;
          }, 0);
      }
      this.expenseAmount.textContent = total;
      return total;
  };

  addExpense = (expense) => {
      const div = document.createElement('div');
      div.classList.add('expense');
      div.innerHTML = `
      <div class="expense-item d-flex justify-content-between
      align-items-baseline">
          <h6 class="expense-title mb-0 text-uppercase list-item">
          - ${expense.title} </h6>
          <h5 class="expense-amount mb-0 list-item">
              ${expense.amount}
          </h5>
          <div class="expense-icons list-item">
              <a href="#" class="edit-icon" data-id="${expense.id}">
                <i class="fas fa-edit"></i>
              </a>          
              <a href="#" class="delete-icon" data-id="${expense.id}">
                  <i class="fas fa-trash"></i>
              </a>
          </div>
       </div>
      `;
      this.expenseList.appendChild(div);
  };

  showBalance = () => {
      const expense = this.totalExpense();
      const total = parseInt(this.budgetAmount.textContent) - expense;

      this.balanceAmount.textContent = total;

      if (total < 0) {
          this.balance.classList.remove('showGreen', 'showBlack');
          this.balance.classList.add('showRed');
      }
      else if (total > 0) {
          this.balance.classList.remove('showBlack', 'showRed');
          this.balance.classList.add('showGreen');
      }
      else {
          this.balance.classList.remove('showGreen', 'showRed');
          this.balance.classList.add('showBlack');
      }
  };

  submitExpenseForm = () => {
      const expenseVal = this.expenseInput.value;
      const amtVal = this.amountInput.value;

      if (expenseVal === '' || amtVal === '' || amtVal < 0) {
        this.expenseFeedback.classList.add('showItem');
        this.expenseFeedback.innerHTML = `
          <p>Values cannot be empty or negative </p>
        `;

        setTimeout(() => {
          this.expenseFeedback.classList.remove('showItem');
        }, 3000);
      }
      else {
        let amt = parseInt(amtVal);
        this.expenseInput.value = '';
        this.amountInput.value = '';

        let expense = {
          id: this.itemID,
          title: expenseVal,
          amount: amt
        };

        this.itemID++;
        this.itemList.push(expense);
        this.addExpense(expense);
        this.showBalance();
      }
  };

  submitBudgetForm = () => {
      const budgetValue = this.budgetInput.value;

      if (budgetValue === '' || budgetValue < 0) {
          this.budgetFeedback.classList.add('showItem');
          this.budgetFeedback.innerHTML = `
              <p>Value cannot be empty or negative</p>
          `;
          setTimeout(() => {
              this.budgetFeedback.classList.remove('showItem');
          }, 3500);
      }
      else {
          this.budgetAmount.textContent = budgetValue;
          this.budgetInput.value = '';
          this.showBalance();
      }
  };

}

eventListeners = () => {

    const budgetForm = document.getElementById('budget-form');
    const expenseForm = document.getElementById('expense-form');

    const expenseList = document.getElementById('expense-list');

    const interface = new UI();

    budgetForm.addEventListener('submit', (event) => {
        event.preventDefault();
        interface.submitBudgetForm();
    });

    expenseForm.addEventListener('submit', (event) => {
        event.preventDefault();
        interface.submitExpenseForm();
    });

    expenseList.addEventListener('click', (event) => {
        const parent = event.target.parentElement;
        const editClicked = parent.classList.contains('edit-icon');
        const deleteClicked = parent.classList.contains('delete-icon');
        
        if (editClicked) {
            interface.editExpense(parent);
        }
        else if (deleteClicked) {
            interface.deleteExpense(parent);
        }
    });

}

document.addEventListener('DOMContentLoaded', function() {
    eventListeners();
});