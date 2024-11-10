import * as Yup from 'yup';

export const validation = (campos, isEdit) => { 
  return Yup.object().shape(

    campos.reduce((acc, campo) => {
      if (!(campo.type === 'select' || (campo.name === 'contrasenia' && isEdit))) { 
        acc[campo.name] = Yup.string()
        .matches(
          campo.pattern ? campo.pattern : /^[^]*$/, 
          `${campo.placeholder} ${campo.pattern == '/^[0-9]*$/' ? 'solo puede contener números' : 'no puede contener caracteres especiales'}`
        )     
        .required(campo.required ? `${campo.placeholder} es requerido` : '')
      } else {
        acc[campo.name] = Yup.string(); 
      }
      return acc;
    }, {})
  );
};