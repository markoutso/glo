nl
  : "\n"+
  ;

repeat_loop
  : "ΑΡΧΗ_ΕΠΑΝΑΛΗΨΗΣ" nl statement_list "ΜΕΧΡΙΣ_ΟΤΟΥ" expression

while_loop
  : "ΟΣΟ" expression "ΕΠΑΝΑΛΑΒΕ" nl statement_list "ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ"

for_loop
  : "ΓΙΑ" (array_access | variable) "ΑΠΟ" expression "ΜΕΧΡΙ" expression "ME BHMA" expression) nl statement_list "ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ"
  ;

if
  : "ΑΝ" expression "ΤΟΤΕ" nl statement_list
  ;

if_statement
  : if ("ΑΛΛΙΩΣ_ΑΝ" expression "ΤΟΤΕ" nl statement_list)* ("ΑΛΛΙΩΣ" nl statement_list)? "ΤΕΛΟΣ_ΑΝ"
  ;

select_case
  : ("=" | "<>" | "<" | ">" | "<=" | ">=") expression
  | expression
  ;

select_statement
  : "ΕΠΙΛΕΞΕ" expression nl ("ΠΕΡΙΠΤΩΣΗ" select_case ("," select_case)* nl statement_list)* ("ΠΕΡΙΠΤΩΣΗ" "ΑΛΛΙΩΣ" nl statement_list)? "ΤΕΛΟΣ_ΕΠΙΛΟΓΩΝ"
  ;

subprogram_declarations
  : (procedure_declaration | function_declaration)*
  ;

variable_declaration
  : "ΜΕΤΑΒΛΗΤΕΣ" nl (type ":" variable([expression ("," expression)*]) ("," variable([expression ("," expression)*])?)* nl)+
  ;

procedure_declaration
  : "ΔΙΑΔΙΚΑΣΙΑ" variable ("(" procedure_or_function_parameter_list ")") nl (variable_declaration) "ΑΡΧΗ" statement_list "ΤΕΛΟΣ_ΔΙΑΔΙΚΑΣΙΑΣ" nl
  ;

function_return_type
  : "ΑΚΕΡΑΙΑ"
  | "ΛΟΓΙΚΗ"
  | "ΧΑΡΑΚΤΗΡΕΣ"
  | "ΠΡΑΓΜΑΤΙΚΗ"
  ;

function_declaration
  : "ΣΥΝΑΡΤΗΣΗ" ("(" procedure_or_function_parameter_list ")") ":" function_return_type nl variable_declaration "ΑΡΧΗ" statement_list "ΤΕΛΟΣ_ΣΥΝΑΡΤΗΣΗΣ" nl
  ;

procedure_or_function_parameter_list
  : (variable ("," variable)*)
  ;

type
  : "ΑΚΕΡΑΙΑ"
  | "ΠΡΑΓΜΑΤΙΚΗ"
  | "ΛΟΓΙΚΗ"
  | "ΧΑΡΑΚΤΗΡΑΣ"
  ;

subrange
  : INTEGER ".." INTEGER
  ;

program
  : "\n"* "ΠΡΟΓΡΑΜΜΑ" variable nl variable_declaration "ΑΡΧΗ" nl statement_list "ΤΕΛΟΣ_ΠΡΟΓΡΑΜΜΑΤΟΣ" nl subprogram_declarations
  ;

statement_list:
  : statement ("\n" statement)*
  ;

read_statement
  : "ΔΙΑΒΑΣΕ" variable([expression ("," expression)*]) ("," variable([expression ("," expression)*])?)*
  ;

write_statement
  : "ΓΡΑΨΕ" expression ("," expression)*
  ;

statement
  : assignment_expression
  | if_statement
  | select_statement
  | for_loop
  | while_loop
  | read_statement
  | write_statement
  | empty
  ;

assignment_expression
  : (array_access | variable) "<-" expression
  ;

variable
  : [α-ωΑ-Ωa-zA-Z_][α-ωΑ-Ωa-zA-Z0-9_]*
  ;

array_access
  : variable "[" expression ("," expression)* "]"
  ;

empty
  :
  ;

expression:
  : term (("=" | "<>" | "<" | ">" | "<=" | ">=") expression)?
  ;

term
  : factor (("+" | "-" | "H") term)?
  ;

factor
  : power (("*" | "div" | "/" | "MOD" | "ΚΑΙ") factor)?
  ;

power
  : atom ("^" power)?
  ;

atom
  : INTEGER
  | "+" atom
  | "-" atom
  | "(" expression ")"
  | array_access
  | variable
  | call
  | "ΑΛΗΘΗΣ"
  | "ΨΕΥΔΗΣ"
  | string_expression
  | "ΟΧΙ" atom
  ;

call_function
  : variable "(" (variable ("," variable)* )? ")"
  ;

call_procedure
  : "ΚΑΛΕΣΕ" variable "(" (variable ("," variable)* )? ")"
  ;
