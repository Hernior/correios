export const digits=s=>String(s).replace(/\D/g,'');
export const mask=s=>digits(s).slice(0,8).replace(/^(\d{5})(\d)/,'$1-$2');
export async function lookup(cep){if(digits(cep).length!==8)throw Error('CEP inválido');const r=await fetch('https://viacep.com.br/ws/'+digits(cep)+'/json/',{signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error('Consulta indisponível');const data=await r.json();if(data.erro)throw Error('CEP não encontrado');return data}
