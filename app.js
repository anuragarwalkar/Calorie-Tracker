//Stroage Controller
const StorageCtrl = (function(){

})();
//Item Controller 
const ItemCtrl = (function(){

    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items: [
            // {id:0, name:'Steak Dinner', calories:1200},
            // {id:1, name:'Cookie', calories:400},
            // {id:2, name:'Eggs', calories:300}
        ], currentItem: null,
        totalCalories:0
    }
        return {
            addItem:function(name, calories){
                
               let ID = 0;
               if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1
               }else{
                ID= 0;
               }

               calories = parseInt(calories);

               newItem = new Item(ID,name,calories);

               data.items.push(newItem);
               return newItem;
            },
            getItems: function(){
                return data.items;
            },
            logData: function(){
                return data;
            },
            getTotalCalories:function(){
                let total = 0;

                data.items.forEach(element=>{
                    total += element.calories;
                });

                data.totalCalories = total;

                return data.totalCalories;
            }
        }
        
        
})();
//UI Controller
const UICtrl = (function(){

    const UISelectros = {
        itemList: '#item-list',
        addBtn:'.add-btn',
        updateBtn:'.update-btn',
        deleteBtn:'.delete-btn',
        backBtn:'.back-btn',
        itemNameInput:'#item-name',
        itemCaloriesInput:'#item-calories',
        totalCalories: '.total-calories'
    }

    return{
    populateItemsList: function(items){
        let html = ''
        items.forEach(item => {
            html += `
            <li class="collection-item" id="item-${item.id}">
       <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
       <a href="#" class="edit-item secondary-content"><i class="fa fa-pencil"></i></a> </li>
            `
        });

        document.querySelector(UISelectros.itemList).innerHTML = html
    }, 

    
    addListItem: function(item){
        document.querySelector(UISelectros.itemList).style.display = 'block';
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.id = `item-${item.id}`
        li.innerHTML = ` <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="edit-item secondary-content"><i class="fa fa-pencil"></i></a>`

        document.querySelector(UISelectros.itemList).insertAdjacentElement('beforeend',li)
            },

    clearInput:function(){
        document.querySelector(UISelectros.itemNameInput).value = '';
        document.querySelector(UISelectros.itemCaloriesInput).value = '';

    },

    hideList: function(){
        document.querySelector(UISelectros.itemList).style.display = 'none';
    },
    getSelectors: function(){
        return UISelectros
    },
    getItemInput: function(){
        return{
            name:document.querySelector(UISelectros.itemNameInput).value,
            calories:document.querySelector(UISelectros.itemCaloriesInput).value
        }
    },
    showTotalCalories: function(total){
        document.querySelector(UISelectros.totalCalories).textContent = total
    },
    clearEditState:function(){
        UICtrl.clearInput();
        document.querySelector(UISelectros.updateBtn).style.display = 'none';
        document.querySelector(UISelectros.deleteBtn).style.display = 'none';
        document.querySelector(UISelectros.backBtn).style.display = 'none';

    }
}

})();
//App Controller
//Load event listeners
const AppCtrl = (function(ItemCtrl,UICtrl){

    const loadEventListners = function(){
    const UISelectors = UICtrl.getSelectors();

    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
    document.querySelector(UISelectors.itemList).addEventListener('click',itemUpdateSubmit)
    }

    const itemUpdateSubmit = function(event){
       event.target.classList.contains('edit-item')

        event.preventDefault();
    }

    const itemAddSubmit = function(event){
        event.preventDefault();
        const input = UICtrl.getItemInput();
        if(input.name !== '' && input.calories !== ''){
            const newItem = ItemCtrl.addItem(input.name, input.calories)
            UICtrl.addListItem(newItem);
            
            const totalCalories = ItemCtrl.getTotalCalories();

            UICtrl.showTotalCalories(totalCalories);

            UICtrl.clearInput();
        }else{
            window.alert('Please Provide Input')
        }
    }
    
    return {
        init : function(){
            UICtrl.clearEditState();
            const items = ItemCtrl.getItems();

            if(items.length === 0){
                UICtrl.hideList();
            }else{
                UICtrl.populateItemsList(items);
            }
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
            loadEventListners();
            
        }
    }
})(ItemCtrl,UICtrl);

AppCtrl.init();