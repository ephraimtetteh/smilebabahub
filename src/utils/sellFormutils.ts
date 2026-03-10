export const validateForm = (formData: any, currentStep: number) => {
  const errors: any = {};

  switch (currentStep) {
    case 1:
      if (!formData.title?.trim()) {
        errors.title = "Title is required";
      }

      if (!formData.category?.trim()) {
        errors.category = "Category is required";
      }

      if (!formData.categoryChild?.trim()) {
        errors.categoryChild = "Sub category is required";
      }

      if (!Object.values(formData.images || []).some((image) => image)) {
        errors.images = "Please select a main image";
      }
      break;

    case 2:
      if (!formData.region?.trim()) {
        errors.region = "Please select a region";
      }

      if (!formData.city?.trim()) {
        errors.city = "Please select a city";
      }

      if (!formData.description?.trim()) {
        errors.description = "Description is required";
      }

      if (!formData.phone?.trim()) {
        errors.phone = "Please add a verified phone";
      }

      if (!formData.price) {
        errors.price = "Please add a price";
      }

      if (!formData.name?.trim()) {
        errors.name = "Please add your name";
      }

      // if (!formData.delivery?.trim()) {
      //   errors.delivery = "Please select a delivery option";
      // }

      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};


// export const submitProductData = async (formData) => {

// }

// export const processProductData = (formData) => {

// }