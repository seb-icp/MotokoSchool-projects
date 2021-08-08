import Nat32 "mo:base/Nat32";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Hash "mo:base/Hash";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Int32 "mo:base/Int32";
// import token
import Result "mo:base/Result";
import Principal "mo:base/Principal";


actor class quizz() = this{
    
    type User = Principal;
    type Balance = Nat;
    type Metadata = Blob;

    type Result = {
        #ok;
        #err;
    };
    type result = [Nat];
    type PrincipalTextual = Text;

    type TransferRequest = {
        from: User;
        to: User;
        amount: Balance;
        metadata: ?Metadata;
    };

    type TransferResponse = Result.Result<(), {
        #Unauthorized;
        #InvalidSource: User;
        #InsufficientBalance;
    }>;


    // To implement hzld tokens distributions 

    stable var participants : [PrincipalTextual] = [] ; //Used to keep track of all the participants to the quizz for the distribution of tokens in case something goes wrong.

    public func alreadyGotToken (user:PrincipalTextual) : async Bool {
        let f = func isInside (user2 : PrincipalTextual) : Bool {
            return (user == user2);
        };
        switch (Array.find<PrincipalTextual>(participants,f)) {
            case (null) return false;
            case (?value) return true;
        };
    };

    func _alreadyGotToken (user:PrincipalTextual) : Bool {
        let f = func isInside (user2 : PrincipalTextual) : Bool {
            return (user == user2);
        };
        switch (Array.find<PrincipalTextual>(participants,f)) {
            case (null) return false;
            case (?value) return true;
        };
    };

    func _newParticipant (user:PrincipalTextual) : async (){
        participants := Array.append<PrincipalTextual>(participants, [user]);
        return;
    };

    public func distribute (user:PrincipalTextual) : async Result {
        switch (_alreadyGotToken(user)) {
            case(true) return(#err);
            case (false) {
                //Faire la requête et ajouter l'user en cas de réponse positive seulement
                let request : TransferRequest = {
                    from = me(); //My account id
                    to = Principal.fromText(user);
                    amount = 100;
                    metadata = null;
                };
               
                switch (await _transferToken(request)) {
                    case (#ok) {
                        ignore(_newParticipant(user));
                        return #ok;
                    };
                    case (#err(something)) {
                        return #err;
                    };
                };
            };
        };
        return #ok
    };

    func _transferToken (request : TransferRequest) : async TransferResponse {
        let canisterToken = actor("qz7gu-giaaa-aaaaf-qaaka-cai") : actor { //TODO add the canister ID of token Canister
            transfer : TransferRequest -> async TransferResponse
        };
        return await canisterToken.transfer(request);
    };

    //Quizz stats implementation

    type Student = {
        name : Text;
        note : Nat32;
        id : Nat32;
    };

    func hashNat32 (number : Nat32) : Hash.Hash{
        Hash.hash(Nat32.toNat(number));
    };


    let Results : HashMap.HashMap<Nat32, Student> = HashMap.HashMap<Nat32,Student>(1 , Nat32.equal , hashNat32);

    func getNumberOfStudent () : Nat32 {
        return (Nat32.fromNat(Results.size()));
    };
    
    public func showAStudent (id: Nat32) : async ?Student {
        Results.get(id);
    };

    func _howManyStudentGot(n : Nat32) : Nat32 {
        var count = 0;
        let iter = Iter.range(0, Results.size());
        for (x in iter) {
            switch(Results.get(Nat32.fromNat(x))) {
                case(null) {};
                case(?student)  { 
                    let noteStudent = student.note;
                    if (noteStudent == n) {
                        count +=1;
                    };
                };
            };
        };
        return (Nat32.fromNat(count));
    };



    // This function should take the result of the quizz has a parameter and returns the note of the student
    func giveNoteToStudent (result : result) :  Nat32 {   
        var counter = 0;
        let answer = [1,2,2,0,2,1,0,2,1,0]; 
        let iter = Iter.range(0,9);
        for (x in iter) {
            if (answer[x] == result[x]) {
                counter += 1;
            }
        };
        return (Nat32.fromNat(counter));
    };



    func generatrice (number : Nat) : Nat32 {
        return (Nat32.fromNat(number));
    };

    public func statisticsStudents() : async [Nat32] {
        let stats = Array.tabulateVar<Nat32>(11, generatrice); 
        let stats2 = Array.freeze(stats);
        let stats3 = Array.map<Nat32,Nat32>(stats2, _howManyStudentGot);
        return (stats3);
    
    };



    public func quizzFinished(name : Text, result : result) : async Nat32 {
        let note = giveNoteToStudent(result);
        let id = getNumberOfStudent();
        let newStudent : Student  = {
            name = name;
            note = note;
            id = id;
        };
        Results.put(id, newStudent);
        return note;
    };

    public func PotentialWinners() : async [Text]{
        var potentialWinners = Array.make<Text>(""); //There is probably a cleaner way to do that...
        let iter = Iter.range(0, Int32.toInt(Int32.fromNat32(getNumberOfStudent())));
        for (x in iter) {
            let student = Results.get(Nat32.fromNat(x)); 
            switch (student) {
                case (null) {};
                case (?student) {
                    if(student.note == 10) {
                        let name = student.name;
                       potentialWinners:= Array.append<Text>(potentialWinners, [name]);
                    };
                };
            };
        };
        return (potentialWinners);
    };

    func me() : Principal {
    return Principal.fromActor(this);
    };

    public func meOutsideWorld() : async Principal {
        return Principal.fromActor(this);
    };

};
