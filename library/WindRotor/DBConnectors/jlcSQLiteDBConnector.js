/**
 * Wind rotor
 * 
 * NOTICE OF LICENSE 
 * 
 * This source file is subject to the GNU GENERAL PUBLIC LICENSE (Version 3)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.gnu.org/licenses/gpl.html
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to red331@mail.ru so we can send you a copy immediately.    
 * 
 * Class jlcSQLiteDBConnector is a part of JavaScript framework - Wind rotor.   
 * 
 * @package     Wind rotor
 * @author      Selihov Sergei Stanislavovich <red331@mail.ru> 
 * @copyright   Copyright (c) 2010-2011 Selihov Sergei Stanislavovich.
 * @license     http://www.gnu.org/licenses/gpl.html  GNU GENERAL PUBLIC LICENSE (Version 3)
 *    
 */
 
/**
 * Classes for work with databases.
 *  
 * @subpackage DBConnectors
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>   
 */
 
/**
 * Documents the jlcSQLiteDBConnector class.
 * 
 * Following class is intended for simplification of tasks connected to the work with SQLite database.
 *   
 * @subpackage jlcSQLiteDBConnector
 * @author Selihov Sergei Stanislavovich <red331@mail.ru> 
 * 
 * @version 1.0
 *     
 */
 
function jlcSQLiteDBConnector()
  {
  };
  
/* Extendable member variables starts here */

/**
 * @access public
 * @var object of type air.File - file of the current database 
 */	

jlcSQLiteDBConnector.prototype.CurDBFile = null;

/**
 * @access public
 * @var object of type air.SQLConnection - current connection to the database 
 */	

jlcSQLiteDBConnector.prototype.CurDBConnection = null;

/**
 * @access public
 * @var string represents connection mode (read, write, update) 
 */	

jlcSQLiteDBConnector.prototype.CurDBConnectionMode = null;

/**
 * @access public
 * @var object of type air.SQLStatement - represents current SQL query 
 */	

jlcSQLiteDBConnector.prototype.CurSQLStatement = new air.SQLStatement();

/**
 * @access public
 * @var object stores last error that occured during execution of the query 
 */	

jlcSQLiteDBConnector.prototype.LastSqlError = null;

/* Extendable member variables ends here */
  
/* Core functions starts here */

/**
 * Function that used to connect to database.
 * 
 * It is a first function that one must call before calling other methods. Also CreateDBFile() method can be called instead of 
 * OpenDBConnection() if database file was not yet created.      
 * 
 * @access public 
 *    
 * @param string|object path to a database file represented in string object or air.File.
 * @param string type of connection mode (read, write, update). 
 * 
 * @throws Error on error      
 * 
 * @return bool returns true on succesfull connection to database.
 * 
 * @see jlcSQLiteDBConnector::CreateDBFile()      
 *                         
 */  

jlcSQLiteDBConnector.prototype.OpenDBConnection = function(usrFilePath, usrConMode)
  {
  var tmpDBFile = null; 
  var tmpSQLConnector = null; 
  var tmpSQLConnectorMode = null;      
  var tmpErrorObj = null;  
  
  /* String clause starts here */
 
  if ((typeof usrFilePath) == 'string')
    {
    if (usrFilePath.length <= 0)
      {
      tmpErrorObj = new Error('File path have a zero length');
      tmpErrorObj.number = 1101;
      tmpErrorObj.name = 'jlcSQLiteDBConnector error';
      tmpErrorObj.description = 'User does not provided file path parametre or it has zero length';
    
      throw tmpErrorObj;
      }
      
    try
      {
      tmpDBFile = new air.File(usrFilePath);           
      }
    catch(tmpError)
      {
      throw tmpError;
      }    
    }
    
  /* String clause ends here */
  
  /* Object clause starts here */
  
  else if((typeof usrFilePath) == 'object')
    {
    tmpDBFile = usrFilePath;
    }
    
  /* Object clause ends here */ 
  
  /* Database connection starts here */
  
  this.FreeResources();
  
  try
    {
    tmpSQLConnector = new air.SQLConnection();
    usrConMode = usrConMode.toLowerCase()
    
    switch(usrConMode)
      {
      case 'create':
      
      tmpSQLConnectorMode = 'create';
      tmpSQLConnector.open(tmpDBFile, air.SQLMode.CREATE);
      break;
      
      case 'read':
      
      tmpSQLConnectorMode = 'read';
      tmpSQLConnector.open(tmpDBFile, air.SQLMode.READ);
      break;
      
      case 'update':
      
      tmpSQLConnectorMode = 'update';
      tmpSQLConnector.open(tmpDBFile, air.SQLMode.UPDATE);
      break;  
      
      default:
      
      tmpSQLConnectorMode = 'read';
      tmpSQLConnector.open(tmpDBFile, air.SQLMode.READ);
      break;    
      } 
    }
  catch(tmpError)
    {
    throw tmpError;
    }
  
  this.CurDBFile = tmpDBFile;
  this.CurDBConnection = tmpSQLConnector;
  this.CurDBConnectionMode = tmpSQLConnectorMode;
  
  this.CurSQLStatement.sqlConnection = this.CurDBConnection;
  
  return true;
  
  /* Database connection ends here */  
  }
  
/**
 * Function that used to close connection to database.
 * 
 * Simple function that closes connection with database.      
 * 
 * @access public 
 *         
 * @return bool returns true on succesfull disconnection from the database.    
 *                         
 */  
  
jlcSQLiteDBConnector.prototype.CloseDBConnection = function()
  {
  if (this.CurDBConnection != null)
    {
    this.CurDBConnection.close();
    this.CurDBConnection = null;
    
    this.CurDBConnectionMode = null;
    this.CurSQLStatement.sqlConnection = null;
    }
    
  return true;
  }
  
/**
 * Function that used to free all resources used while working with database.
 * 
 * Simple function that returns current object to its initial state.      
 * 
 * @access public 
 *         
 * @return bool returns true on succesfull garbage collection.    
 *                         
 */ 

jlcSQLiteDBConnector.prototype.FreeResources = function()
  {
  this.CurDBFile = null;
  this.CurSQLStatement.text = '';
  
  this.tmpError = null;
  
  this.CloseDBConnection();
  
  return true;
  }
  
/**
 * Function that used to create database file.
 * 
 * It is a first function that one must call before calling other methods. Also OpenDBConnection() method can be called instead of 
 * CreateDBFile() if database file already exist. This function can also be used for connection to database.      
 * 
 * @access public 
 *    
 * @param string|object path to a database file represented in string object or air.File.
 * @param bool true if one wants to establish connection to newly created database file.
 * @param string type of connection mode (read, write, update). 
 * 
 * @throws Error on error      
 * 
 * @return bool returns true on succesfull creation of the database file.
 * 
 * @see jlcSQLiteDBConnector::OpenDBConnection()      
 *                         
 */  
 
jlcSQLiteDBConnector.prototype.CreateDBFile = function(usrFilePath, usrConnect, usrConMode)
  {
  var tmpDBFile = null;
  var tmpStream = new air.FileStream();
  
  var tmpErrorObj = null;
 
  /* String clause starts here */
 
  if ((typeof usrFilePath) == 'string')
    {
    if (usrFilePath.length <= 0)
      {
      tmpErrorObj = new Error('File path have a zero length');
      tmpErrorObj.number = 1101;
      tmpErrorObj.name = 'jlcSQLiteDBConnector error';
      tmpErrorObj.description = 'User does not provided file path parametre or it has zero length';
    
      throw tmpErrorObj;
      }
      
    try
      {
      tmpDBFile = new air.File(usrFilePath);           
      }
    catch(tmpError)
      {
      throw tmpError;
      }    
    }
    
  /* String clause ends here */
  
  /* Object clause starts here */
  
  else if((typeof usrFilePath) == 'object')
    {
    tmpDBFile = usrFilePath;
    }
    
  /* Object clause ends here */
  
  /* Database file creation starts here */
 
  try
    {
    if (tmpDBFile.exists == false)
      {
      tmpStream = new air.FileStream();
        
      tmpStream.open(tmpDBFile, air.FileMode.WRITE);
      tmpStream.close();
      }            
    }
  catch(tmpError)
    {
    throw tmpError;
    }
    
  /* Database file creation ends here */  
  
  /* Database connection starts here */
  
  if (usrConnect == true)
    {
    try
      {
      this.OpenDBConnection(tmpDBFile, usrConMode);
      }
    catch(tmpError)
      {
      throw tmpError;
      }
    }  
  
  return true;
  /* Database connection ends here */   
  }
  
/**
 * Function that used to execute user defined SQL query.
 * 
 * Mainly used to execute queries such as INSERT or UPDATE. For queries that returns result please use other functions.
 * Note that you must first establish connection with the database.    
 * 
 * @access public 
 *    
 * @throws Error on error      
 * 
 * @return bool returns true on succesfull execution of the query.
 * 
 * @see jlcSQLiteDBConnector::OpenDBConnection() 
 * @see jlcSQLiteDBConnector::CreateDBFile()      
 *                         
 */  
  
jlcSQLiteDBConnector.prototype.ExecuteQuery = function()
  {
  var tmpErrorObj = null;
  
  if (this.CurDBFile == null)
    {
    tmpErrorObj = new Error('Current database file is not yet set');
    tmpErrorObj.number = 1105;
    tmpErrorObj.name = 'jlcSQLiteDBConnector error';
    tmpErrorObj.description = 'Current database file is not yet set, connection to database is not exist yet'; 
    
    throw tmpErrorObj;    
    }
  else if (this.CurDBConnection == null)
    {
    tmpErrorObj = new Error('Connection to database is not yet set');
    tmpErrorObj.number = 1106;
    tmpErrorObj.name = 'jlcSQLiteDBConnector error';
    tmpErrorObj.description = 'There is no active connection to the database'; 
    
    throw tmpErrorObj;
    }
  else if (this.CurSQLStatement.text <= 0)
    {
    tmpErrorObj = new Error('SQL query length is less than or equal to zero');
    tmpErrorObj.number = 1103;
    tmpErrorObj.name = 'jlcSQLiteDBConnector error';
    tmpErrorObj.description = 'User provided zero length sql query which is not possible'; 
    
    throw tmpErrorObj;   
    }
  
  try
    {  
    this.CurSQLStatement.execute();
    }
  catch(tmpError)
    {
    this.LastSqlError = tmpError;
    
    tmpErrorObj = new Error('Error while executing sql query');
    tmpErrorObj.number = 1107;
    tmpErrorObj.name = 'jlcSQLiteDBConnector error';
    tmpErrorObj.description = 'Error while executing sql query'; 
    
    throw tmpErrorObj;     
    }
  
  return true;   
  } 
    
/* Core functions ends here */

/* Get functions starts here */

/**
 * Function that returns current database file.
 * 
 * Simple function that returns current database file with which connection is established.     
 * 
 * @access public 
 * 
 * @throws Error on error      
 * 
 * @return object returns air.File if database file was already set previously.
 *                               
 */ 

jlcSQLiteDBConnector.prototype.GetDBFile = function()
  {
  var tmpErrorObj = null;
  
  if (this.CurDBFile == null)
    {
    tmpErrorObj = new Error('Current database file is not yet set');
    tmpErrorObj.number = 1105;
    tmpErrorObj.name = 'jlcSQLiteDBConnector error';
    tmpErrorObj.description = 'Current database file is not yet set, connection to database is not exist yet'; 
    
    throw tmpErrorObj;    
    }
  else
    {
    return this.CurDBFile;
    }
  }
  
/**
 * Function that returns path to the current database file.
 * 
 * Simple function that returns path to the current database file with which connection is established.     
 * 
 * @access public 
 * 
 * @throws Error on error      
 * 
 * @return string returns path to the database file if it was set previously.
 *                               
 */ 
  
jlcSQLiteDBConnector.prototype.GetDBFilePath = function()
  {
  var tmpErrorObj = null;
  
  if (this.CurDBFile == null)
    {
    tmpErrorObj = new Error('Current database file is not yet set');
    tmpErrorObj.number = 1105;
    tmpErrorObj.name = 'jlcSQLiteDBConnector error';
    tmpErrorObj.description = 'Current database file is not yet set, connection to database is not exist yet'; 
    
    throw tmpErrorObj;    
    }
  else
    {
    return this.CurDBFile.url.substring(8);
    }
  }
  
/**
 * Function that used to return current query to database.
 * 
 * Simple function that returns current query to database.     
 * 
 * @access public 
 * 
 * @throws Error on error      
 * 
 * @return string returns current query to database.
 *                               
 */  
  
jlcSQLiteDBConnector.prototype.GetQuery = function()
  {
  var tmpErrorObj = null;
  
  if (this.CurSQLStatement.text <= 0)
    {
    tmpErrorObj = new Error('SQL query length is less than or equal to zero');
    tmpErrorObj.number = 1103;
    tmpErrorObj.name = 'jlcSQLiteDBConnector error';
    tmpErrorObj.description = 'User provided zero length sql query which is not possible'; 
    
    throw tmpErrorObj;   
    }  
   
  return this.CurSQLStatement.text;
  }
  
/**
 * Function that used to return last error that was occured during execution of the query.
 * 
 * Simple function that returns last error that occured during execution of the query.     
 * 
 * @access public      
 * 
 * @return object returns last error.
 *                               
 */   
  
jlcSQLiteDBConnector.prototype.GetLastError = function()
  {
  return this.LastSqlError; 
  }
  
/**
 * Function that used to return simple column result from the query.
 * 
 * Simple function that returns simple colum results from user defined query.
 * Note that you do not need to call ExecuteQuery() function before calling GetResult(). You only need to set query
 * using SetQuery() function.     
 * 
 * @access public 
 *    
 * @throws Error on error      
 * 
 * @return mixed|bool returns result value on succes, false if there is nothing to return.
 * 
 * @see jlcSQLiteDBConnector::SetQuery()     
 *                         
 */   

jlcSQLiteDBConnector.prototype.GetResult = function()
  {
  var tmpResult = null;
  
  try
    {
    this.ExecuteQuery();
    }
  catch (tmpError)
    {
    throw tmpError; 
    }
    
  tmpResult = this.CurSQLStatement.getResult().data;
  
  if (tmpResult == null)
    {
    return false;
    }
  else
    {
    for (var tmpKey in tmpResult[0])
      {
      return tmpResult[0][tmpKey];
      }
    }  
  }
  
/**
 * Function that used to return simple row result from the query.
 * 
 * Simple function that returns simple row results from user defined query in a form of associative.
 * Note that you do not need to call ExecuteQuery() function before calling GetResultRow(). You only need to set query
 * using SetQuery() function.    
 * 
 * @access public 
 *    
 * @throws Error on error      
 * 
 * @return array|bool returns result array on succes, false if there is nothing to return.
 * 
 * @see jlcSQLiteDBConnector::SetQuery()     
 *                         
 */   
  
jlcSQLiteDBConnector.prototype.GetResultRow = function()
  {
  var tmpResult = null;
  
  try
    {
    this.ExecuteQuery();
    }
  catch (tmpError)
    {
    throw tmpError; 
    }
    
  tmpResult = this.CurSQLStatement.getResult().data;
  
  if (tmpResult == null)
    {
    return false;
    }
  else
    {
    return tmpResult[0]; 
    }  
  }
  
/**
 * Function that used to get query results in form of key-value pairs.
 * 
 * Simple function that returns results of the current query in form  of single dimensional associative array. Keys in the 
 * array are taken from values of the column which name was provided by the user. Value for the current index is taken
 * from the second column. Note that you do not need to call ExecuteQuery() function before calling GetResultAssoc(). 
 * You only need to set query using SetQuery() function. Note also that this function only works with two column tables.   
 * 
 * @access public 
 * 
 * @param string name of the column table which values will be used as keys in the resultng array.  
 *    
 * @throws Error on error      
 * 
 * @return object|bool returns object(associative array) on succes, false if there is nothing to return.
 * 
 * @see jlcSQLiteDBConnector::SetQuery()     
 *                         
 */  
  
jlcSQLiteDBConnector.prototype.GetResultColumnPairs = function(usrColumn)
  {
  var tmpResult = null;
  var tmpFormatedArray = new Object();
  var tmpErrorObj = null;
  
  var Counter1 = 0;
  var tmpColumnValue = '';
  
  if (((typeof usrColumn) != 'string') || (usrColumn.length <= 0))
    {
    tmpErrorObj = new Error('User provided invalid column name');
    tmpErrorObj.number = 1108;
    tmpErrorObj.name = 'jlcSQLiteDBConnector error';
    tmpErrorObj.description = 'User provided zero length on non string column name'; 
    
    throw tmpErrorObj;       
    }
  
  try
    {
    this.ExecuteQuery();
    }
  catch (tmpError)
    {
    throw tmpError; 
    }
    
  tmpResult = this.CurSQLStatement.getResult().data;
  
  if (tmpResult == null)
    {
    return false;
    }
  else
    {
    if (!tmpResult[0][usrColumn])
      {
      return false;
      }

    for (Counter1 = 0; Counter1 < tmpResult.length; Counter1++)
      {
      for (var tmpColumn in tmpResult[Counter1])
        {
        if (tmpColumn == usrColumn)
          {
          tmpColumnValue = tmpResult[Counter1][tmpColumn];
          continue;
          }

        tmpFormatedArray[tmpColumnValue] = tmpResult[Counter1][tmpColumn];       
        }      
      }
    } 
          
  return tmpFormatedArray; 
  }
  
/**
 * Function that used to get query results in form of associative array.
 * 
 * Simple function that returns results of the current query in form of associative array. First index form the array is numerical
 * which represents row from the database, second index represents column name.
 * Note that you do not need to call ExecuteQuery() function before calling GetResultAssoc(). You only need to set query
 * using SetQuery() function.   
 * 
 * @access public 
 *    
 * @throws Error on error      
 * 
 * @return array|bool returns associative array on succes, false if there is nothing to return.
 * 
 * @see jlcSQLiteDBConnector::SetQuery()     
 *                         
 */        
   
jlcSQLiteDBConnector.prototype.GetResultAssoc = function()
  {
  var tmpResult = null;
  
  try
    {
    this.ExecuteQuery();
    }
  catch (tmpError)
    {
    throw tmpError; 
    }
    
  tmpResult = this.CurSQLStatement.getResult().data;
  
  if (tmpResult == null)
    {
    return false;
    }
  else
    {
    return tmpResult; 
    }  
  }

/* Get functions ends here */  

/* Set functions starts here */

/**
 * Function that used to set current query.
 * 
 * Simple function that sets current query to the database.  
 * 
 * @access public 
 *    
 * @throws Error on error         
 *                         
 */ 

jlcSQLiteDBConnector.prototype.SetQuery = function(usrQuery)
  {
  var tmpErrorObj = null;

  if ((typeof usrQuery) != 'string')
    {
    tmpErrorObj = new Error('SQL query is not a string');
    tmpErrorObj.number = 1102;
    tmpErrorObj.name = 'jlcSQLiteDBConnector error';
    tmpErrorObj.description = 'User does not provided correct sql query'; 
    
    throw tmpErrorObj;  
    }
  else if (usrQuery.length <= 0)
    {
    tmpErrorObj = new Error('SQL query length is less than or equal to zero');
    tmpErrorObj.number = 1103;
    tmpErrorObj.name = 'jlcSQLiteDBConnector error';
    tmpErrorObj.description = 'User  provided zero length sql query which is not possible'; 
    
    throw tmpErrorObj;  
    }
  
  try
    {
    this.CurSQLStatement.text = usrQuery;
    } 
  catch (tmpError)
    {
    tmpErrorObj = new Error('SQL query is executing');
    tmpErrorObj.number = 1104;
    tmpErrorObj.name = 'jlcSQLiteDBConnector error';
    tmpErrorObj.description = 'Can not redefine sql query while previous statement is executing'; 
    
    throw tmpErrorObj; 
    } 
    
  return true;  
  }
 
/* Set functions ends here */                                