using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Net.Http;
using System.Web.Http;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Net.Http.Headers;
using System.Data;
using Microsoft.Extensions.Configuration;
using Elasticsearch.Net;
using Nest;
using System.Reflection;
using CrystalDecisions.CrystalReports.Engine;


namespace MOI.AssetManagement.Controllers {
    public class FileUploadVwModal
    {
       public IFormFile File { get; set; }
        public long Size { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
    }

    public class Driver
    {

        public string name { get; set; }
        public string idnumber { get; set; }
        public string telnumber { get; set; }
        public string empNumber { get; set; }


    }

    public class QryString
{
    public string Qry { get; set; }
}

 /*   public class DriverInfo
    {
        public Int64 Id { get; set; },
         public string Name { get; set; }
    }*/

    [Route("api/[controller]")]
    public class MapController : Controller
    {
        public IConfiguration _connectionstring { get; }
        public String constr2;
        public MapController (IConfiguration configuration)
        {
            _connectionstring = configuration;
            constr2 = _connectionstring["ConnectionStrings:DefaultConnection"];
    }
        public static string LngLat = "Rameez";
        //  public String constr = "Server=BCI666016PC57;Database=MOI_Assets;Integrated Security=true;User Id=Asset User;Password=12345;Trusted_Connection=True;MultipleActiveResultSets=true";
        

       [HttpGet]
        public DataTable GetDriverQuery(String w_clause)
        {
            SqlConnection cont = new SqlConnection();
            cont.ConnectionString = constr2;
            cont.Open();
            DataTable dt = new DataTable();
             SqlDataAdapter da = new SqlDataAdapter("select * from driverinfo "+ HttpUtility.HtmlDecode(w_clause), cont);
              da.Fill(dt);
            cont.Close();
            cont.Dispose();
          //  List <DriverInfo> = new List<DriverInfo>;

            return dt;
        }

        [HttpPost("SaveDriverDtl")]
        public string PostSaveData([FromBody] Driver dcls)
        {
            SqlConnection cont = new SqlConnection();
            cont.ConnectionString = constr2;
            cont.Open();
            DataTable dt = new DataTable();
            //SqlDataAdapter da = new SqlDataAdapter("select * from driverinfo " + HttpUtility.HtmlDecode(w_clause), cont);
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = cont;
            cmd.CommandText = " update driverinfo set idnumber='" + dcls.idnumber + "' ,telnumber='" + dcls.telnumber + "' where name='" + dcls.name + "'";
            cmd.ExecuteNonQuery();
            //da.Fill(dt);
            cont.Close();
            cont.Dispose();
            return "Saved Successfully";
        }

        [HttpPost]
        public string  PostUpload(List<IFormFile> files)
        {
            IFormFile item = files[0];
            // foreach (IFormFile item in files)
            //{
            string filename = ContentDispositionHeaderValue.Parse(item.ContentDisposition).FileName.Trim('"');
            filename = this.EnsureFileame(filename);
            using (FileStream filestream = System.IO.File.Create(this.GetPath(filename)))
            {
                item.CopyTo(filestream);
            }
            // }
            return "assets/uploads/" + filename;
        }

        private string GetPath(string filename)
        {
            string path = "G:\\Thabeet\\BackUpThabeetIMO\\src\\QuickApp\\ClientApp\\src\\assets\\uploads\\";
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            return path + filename;
        }

        private string EnsureFileame(string filename)
        {
            if (filename.Contains("\\"))
            {
                filename = filename.Substring(filename.LastIndexOf("\\") + 1);
            }
            return filename;
        }




        [HttpGet("DriverElastic")]
        public DataTable GetDriverElasticQuery(String w_clause)
        {
            ElasticClient es = new ElasticClient();
            es = EsClient();
            QueryContainer ContQry = new QueryContainer();
            MatchAllQuery Qry1 = new MatchAllQuery();
            Qry1.Name = "Qry1";

            ContQry = Qry1;
            SearchRequest esserach = new SearchRequest();
            esserach.Query = ContQry;
            
            SearchDescriptor<Driver> esdesct = new SearchDescriptor<Driver>();

           

           // var esresponse = new SearchResponse<DriverInfo>();
           var esresponse = es.Search<Driver>(esserach);
            DataTable dt = new DataTable();
            if (esresponse.Documents.Count > 0)
                {
                dt = ListToDataTable<Driver>(esresponse.Documents.ToList());
                }
            
            
            return dt;
        }

        [HttpGet("PrintDtls")]
        public string PrintDtls(String w_clause)
        {
            String rptname = "";
            ReportDocument rd = new ReportDocument();
            rd.Load("G:\\Thabeet\\BackUpThabeetIMO\\src\\QuickApp\\CrystalReports\\Report1.Rpt");

            rd.SetDataSource(GetDriverQuery(""));

            //Response.Buffer = false;
            //Response.ClearContent();
            //Response.ClearHeaders();
            return "/assets/Attachments/" + rptname;
        }
        #region Connection string to connect with Elasticsearch  

        public static DataTable ListToDataTable<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            //Get all the properties
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo prop in Props)
            {
                //Defining type of data column gives proper data table 
                var type = (prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>) ? Nullable.GetUnderlyingType(prop.PropertyType) : prop.PropertyType);
                //Setting column names as Property names
                dataTable.Columns.Add(prop.Name, type);
            }
            foreach (T item in items)
            {
                var values = new object[Props.Length];
                for (int i = 0; i < Props.Length; i++)
                {
                    //inserting property values to datatable rows
                    values[i] = Props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }
            //put a breakpoint here and check datatable
            return dataTable;
        }
        public ElasticClient EsClient()
        {
            var nodes = new Uri[]
            {
                new Uri("http://localhost:9200/"),
            };

            var connectionPool = new StaticConnectionPool(nodes);
            var connectionSettings = new ConnectionSettings(connectionPool).DisableDirectStreaming();
            connectionSettings.DefaultIndex("driverinfo");
            var elasticClient = new ElasticClient(connectionSettings);

            return elasticClient;
        }

        #endregion Connection string to connect with Elasticsearch  

        /*  public async Task<IActionResult> Post(List<IFormFile> files)
          {
              long size = files.Sum(f => f.Length);

              // full path to file in temp location
              var filePath = Path.GetTempFileName();

              foreach (var formFile in files)
              {
                  if (formFile.Length > 0)
                  {
                      using (var stream = new FileStream(filePath, FileMode.Create))
                      {
                          await formFile.CopyToAsync(stream);
                      }
                  }
              }


              return Ok(new { count = files.Count, size, filePath });
          }*/
    }


}