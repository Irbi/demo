1. How are you thinking of implementing proof storage?
    - We propose to use Web3 storage: within Web3 data is stored as a set of encrypted fragments across multiple nodes, so the the entire data cannot be compromised.
    Besides, as Web3 is a decentralized storage, the data is always accessible even if some nodes failed

2. Core Library Integration with Mina Blockchain
   - Do you have a target wallet in mind to integrate with ?
	    - We propose to use https://github.com/aurowallet or https://github.com/palladians/pallad

3. Standardized Attestation Construction API:
   - What are the key components of the Attestation API?
        - data collector (including secure reading (mrz/nfc) and KYC integration)
        - secured data storage
        - flexible proofs composer and commands interpreter (DSL) 
        - attestation proofs based on zk-SNARKs

   - How will nullifier and expiration support be implemented in the proofs?
	    - We propose to implement nullifiers basing on o1js (https://github.com/o1-labs/o1js/tree/main)

   - Can you provide technical details on how these features will work?
        
        
4. Domain-Specific Language (DSL) Development:
   - What syntax and structure are you considering for the DSL you plan to implement?
        
        To avoid redundancy, it will be implemented as a set of predefined simple circuits. 
        
        On a high level, the structure will by the following:
        - Compiler -- converts inputs into DSL code 
        - Interpreter -- generates an execution pipeline from the input set of actions
        - Executor -- creates ZKPs from the execution pipeline and returns output
        
        As a DSL syntax, we propose to use the bash-like syntax as a well-known, simple and expressive enough to describe any subsequence of actions     
        
5. What are your thoughts regarding security and preventing proof reuse?
        
    To prevent proof reuse we will implement proof nullifiers mentioned above.
    
    Besides, every attestation input must include user's pubKey as a guarantee of its authenticity.  
