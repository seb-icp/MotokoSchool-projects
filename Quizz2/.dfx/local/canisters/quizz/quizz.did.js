export default ({ IDL }) => {
  const PrincipalTextual = IDL.Text;
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Null });
  const result = IDL.Vec(IDL.Nat);
  const Student = IDL.Record({
    'id' : IDL.Nat32,
    'name' : IDL.Text,
    'note' : IDL.Nat32,
  });
  const quizz = IDL.Service({
    'PotentialWinners' : IDL.Func([], [IDL.Vec(IDL.Text)], []),
    'alreadyGotToken' : IDL.Func([PrincipalTextual], [IDL.Bool], []),
    'distribute' : IDL.Func([PrincipalTextual], [Result], []),
    'quizzFinished' : IDL.Func([IDL.Text, result], [IDL.Nat32], []),
    'showAStudent' : IDL.Func([IDL.Nat32], [IDL.Opt(Student)], []),
    'statisticsStudents' : IDL.Func([], [IDL.Vec(IDL.Nat32)], []),
  });
  return quizz;
};
export const init = ({ IDL }) => { return []; };