window.onload = function () {
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            const obj = JSON.parse(localStorage[key]);
            showUseronScreen(obj);
        }
    }
};
function savetoLocalStorage(event){
    event.preventDefault()
        const expense = event.target.expenseamount.value;
        const description = event.target.description.value;
        const category = event.target.category.value;
        const obj = {
            expense,
            description,
            category
        }
        localStorage.setItem(obj.description , JSON.stringify(obj))
        showUseronScreen(obj)

        event.target.reset();
}
function showUseronScreen(obj) {
    const parentElem = document.getElementById('listofitems')
    const childElem = document.createElement('li')
    childElem.textContent = obj.expense + '-' + obj.description + '-' + obj.category;

    const deleteExpenseButton = document.createElement('input')
    deleteExpenseButton.type = "Button";
    deleteExpenseButton.value = "Delete Expense";
    deleteExpenseButton.onclick = () => {
        localStorage.removeItem(obj.description)
        parentElem.removeChild(childElem)
    }
    const editExpenseButton = document.createElement('input')
    editExpenseButton.type = "Button";
    editExpenseButton.value = "Edit Expense";
    editExpenseButton.onclick = () => {
        localStorage.removeItem(obj.description)
        parentElem.removeChild(childElem)
        document.getElementById('expenseamount').value = obj.expense;
        document.getElementById('description').value = obj.description;
        document.getElementById('category').value = obj.category;

    }
    childElem.appendChild(deleteExpenseButton)
    childElem.appendChild(editExpenseButton)
    parentElem.appendChild(childElem)
}