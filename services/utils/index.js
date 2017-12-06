import moment from 'moment';

export const generateMessage = (from, message) => {
  return {
    from,
    message,
    createdAt: moment().format('LT')
  };
};
export const generateMessageTo = (from, to, message)=>{
  return{
    from,
    to,
    message,
    createdAt: moment().format('LT')
  }
}

export const isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
  };
  