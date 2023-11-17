// - parses string
// - ensures it is valid json
// - ensures it meets our spec for messages
//  - ensures it corresponds an actual method
//  - ensures the arguments/return value match the
//    method signature
// - builds the objects which corresponds to the return value or arugments
// - returns an object of type 

type callMessage = takeTurnCall | // union of call types

type returnMessage = takeTurnResponse | // union of return types

type takeTurnCall = {
  methodName: 'takeTurn',
  args : {
    publicState: Relevane
  }
}

type takeTurnResponse = {
  
}

function jsonValidator(json: string) {}