export const validateFrom = (currentStep) => {
  const errors ={}

  switch(currentStep){
    case 1:
      if(title.trim()){
        errors.title = 'title is required'
      } 
      if(!Object.values.category || {}).some(category => category){
        errors.category = 'please select a category'
      }
      if(!Object.values.category || {}).some(category => category){
        errors.category = 'please select a category'
      }

  }
}